import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string): Promise<any> {
    try {
      this.logger.log(`Buscando estatísticas do dashboard para usuário ${userId}`);

      // Calcular período da semana atual
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // 1. Treinos desta semana
      const weeklyWorkouts = await this.prisma.workout.count({
        where: {
          userId,
          completedAt: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
      });

      // 2. Total de treinos
      const totalWorkouts = await this.prisma.workout.count({
        where: {
          userId,
          isCompleted: true,
        },
      });

      // 3. Duração média dos treinos
      const workoutDurations = await this.prisma.workout.findMany({
        where: {
          userId,
          isCompleted: true,
          duration: { not: 0 },
        },
        select: { duration: true },
      });

      const averageWorkoutDuration = workoutDurations.length > 0 
        ? Math.round(workoutDurations.reduce((sum, w) => sum + (w.duration || 0), 0) / workoutDurations.length)
        : 0;

      // 4. Streak baseado em desafios diários completados
      const { currentStreak, bestStreak } = await this.calculateChallengeStreak(userId);

      // 5. Dias ativos no último mês
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      oneMonthAgo.setHours(0, 0, 0, 0);

      // Buscar treinos completados no último mês
      const workoutsLastMonth = await this.prisma.workout.findMany({
        where: {
          userId,
          completedAt: {
            gte: oneMonthAgo,
          },
        },
        select: {
          completedAt: true,
        },
      });

      // Contar dias únicos
      const uniqueDays = new Set();
      workoutsLastMonth.forEach(workout => {
        if (workout.completedAt) {
          const day = new Date(workout.completedAt).toISOString().split('T')[0];
          uniqueDays.add(day);
        }
      });

      const activeDaysLastMonth = uniqueDays.size;

      // 6. Objetivos
      const goalsAchieved = await this.prisma.userGoal.count({
        where: {
          userId,
          // Assumindo que um objetivo é "alcançado" quando o progresso é 100%
          // Você pode ajustar essa lógica conforme necessário
        },
      });

      const goalsInProgress = await this.prisma.userGoal.count({
        where: {
          userId,
          isActive: true,
        },
      });

      return {
        weeklyWorkouts,
        weeklyGoal: 5, // Meta padrão
        totalWorkouts,
        averageWorkoutDuration,
        currentStreak,
        bestStreak,
        activeDaysLastMonth,
        goalsAchieved,
        goalsInProgress,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar estatísticas do dashboard: ${error.message}`, error.stack);
      throw new Error('Erro ao buscar estatísticas do dashboard, tente novamente mais tarde');
    }
  }

  private async calculateChallengeStreak(userId: string): Promise<{ currentStreak: number; bestStreak: number }> {
    try {
      // Buscar todos os desafios diários completados, ordenados por data
      const completedChallenges = await (this.prisma as any).dailyChallenge.findMany({
        where: {
          userId,
          isCompleted: true,
        },
        orderBy: {
          completedAt: 'desc',
        },
        select: {
          completedAt: true,
        },
      });

      if (completedChallenges.length === 0) {
        return { currentStreak: 0, bestStreak: 0 };
      }

      // Calcular streak atual
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      // Agrupar por data para verificar dias consecutivos
      const challengesByDate = new Map<string, number>();
      
      completedChallenges.forEach(challenge => {
        if (challenge.completedAt) {
          const date = new Date(challenge.completedAt).toISOString().split('T')[0];
          challengesByDate.set(date, (challengesByDate.get(date) || 0) + 1);
        }
      });

      // Ordenar datas
      const sortedDates = Array.from(challengesByDate.keys()).sort().reverse();
      
      // Calcular streak atual (dias consecutivos a partir de hoje)
      const today = new Date().toISOString().split('T')[0];
      let currentDate = new Date();
      
      for (let i = 0; i < 365; i++) { // Verificar até 1 ano atrás
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (challengesByDate.has(dateStr)) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calcular melhor streak
      tempStreak = 0;
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDateStr = sortedDates[i];
        const nextDateStr = i < sortedDates.length - 1 ? sortedDates[i + 1] : null;
        
        if (nextDateStr) {
          const currentDate = new Date(currentDateStr);
          const nextDate = new Date(nextDateStr);
          const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            bestStreak = Math.max(bestStreak, tempStreak + 1);
            tempStreak = 0;
          }
        } else {
          tempStreak++;
        }
      }
      
      bestStreak = Math.max(bestStreak, tempStreak);

      return { currentStreak, bestStreak };
    } catch (error) {
      this.logger.error(`Erro ao calcular streak de desafios: ${error.message}`, error.stack);
      return { currentStreak: 0, bestStreak: 0 };
    }
  }
}
