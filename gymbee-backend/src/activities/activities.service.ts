import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private prisma: PrismaService) {}

  async getRecentActivities(userId: string, limit: number = 10): Promise<any[]> {
    try {
      this.logger.log(`Buscando atividades recentes para usuário ${userId}`);

      // Buscar atividades recentes: treinos, pesagens, conquistas, desafios
      const activities: any[] = [];

      // 1. Treinos recentes
      const recentWorkouts = await this.prisma.workout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          isCompleted: true,
          completedAt: true,
          createdAt: true,
          source: true,
        },
      });

      recentWorkouts.forEach(workout => {
        activities.push({
          id: `workout-${workout.id}`,
          type: 'workout',
          title: workout.isCompleted ? 'Treino Concluído' : 'Treino Criado',
          description: workout.name,
          date: workout.isCompleted ? workout.completedAt : workout.createdAt,
          metadata: {
            workoutType: workout.type,
            source: workout.source,
          },
        });
      });

      // 2. Pesagens recentes
      const recentWeights = await this.prisma.weightEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          weight: true,
          createdAt: true,
          notes: true,
        },
      });

      recentWeights.forEach(weight => {
        activities.push({
          id: `weight-${weight.id}`,
          type: 'weight',
          title: 'Peso Registrado',
          description: `${weight.weight}kg${weight.notes ? ` - ${weight.notes}` : ''}`,
          date: weight.createdAt,
          metadata: {
            weight: weight.weight,
            notes: weight.notes,
          },
        });
      });

      // 3. Conquistas recentes
      const recentAchievements = await this.prisma.userAchievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          unlockedAt: true,
          isRead: true,
        },
      });

      recentAchievements.forEach(achievement => {
        activities.push({
          id: `achievement-${achievement.id}`,
          type: 'achievement',
          title: 'Conquista Desbloqueada',
          description: achievement.title,
          date: achievement.unlockedAt,
          metadata: {
            achievementType: achievement.type,
            isRead: achievement.isRead,
          },
        });
      });

      // 4. Desafios diários recentes
      const recentDailyChallenges = await (this.prisma as any).dailyChallenge.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          challenge: {
            select: {
              title: true,
              description: true,
              points: true,
            },
          },
        },
      });

      recentDailyChallenges.forEach(challenge => {
        activities.push({
          id: `challenge-${challenge.id}`,
          type: 'challenge',
          title: challenge.isCompleted ? 'Desafio Completado' : 'Desafio Aceito',
          description: challenge.challenge.title,
          date: challenge.isCompleted ? challenge.completedAt : challenge.createdAt,
          metadata: {
            points: challenge.challenge.points,
            isCompleted: challenge.isCompleted,
          },
        });
      });

      // Ordenar todas as atividades por data
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Retornar apenas o limite solicitado
      return activities.slice(0, limit);
    } catch (error) {
      this.logger.error(`Erro ao buscar atividades recentes: ${error.message}`, error.stack);
      throw new Error('Erro ao buscar atividades recentes, tente novamente mais tarde');
    }
  }
}
