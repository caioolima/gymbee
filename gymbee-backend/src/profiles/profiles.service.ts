import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserProfileDto, TrainerProfileDto, UserAnalyticsDto, TrainerAnalyticsDto, UserGoalSummaryDto, WeeklyWorkoutDto } from './view/ProfileViewDTO';
import { GoalType, ActivityLevel, ExperienceLevel, ContractStatus } from '@prisma/client';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private prisma: PrismaService) {}

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  private calculateDaysRemaining(deadline: Date): number {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDayName(dayOfWeek: number): string {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          goals: {
            where: {
              deadline: {
                gte: new Date(),
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          checkIns: {
            where: {
              checkInAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
              },
            },
            include: {
              gym: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const age = this.calculateAge(user.birthDate);

      // Processar objetivo ativo
      let activeGoal: UserGoalSummaryDto | undefined;
      if (user.goals.length > 0) {
        const goal = user.goals[0];
        const currentBMI = this.calculateBMI(goal.currentWeight, goal.height);
        const targetBMI = this.calculateBMI(goal.targetWeight, goal.height);
        const weightDifference = goal.targetWeight - goal.currentWeight;
        const daysRemaining = this.calculateDaysRemaining(goal.deadline);

        activeGoal = {
          id: goal.id,
          goalType: goal.goalType,
          currentWeight: goal.currentWeight,
          targetWeight: goal.targetWeight,
          height: goal.height,
          activityLevel: goal.activityLevel,
          experienceLevel: goal.experienceLevel,
          deadline: goal.deadline,
          currentBMI,
          targetBMI,
          weightDifference,
          daysRemaining,
          createdAt: goal.createdAt,
        };
      }

      // Processar treinos da semana (mock por enquanto)
      const weeklyWorkouts: WeeklyWorkoutDto[] = [];
      for (let i = 0; i < 7; i++) {
        weeklyWorkouts.push({
          dayOfWeek: i,
          dayName: this.getDayName(i),
          workoutCount: Math.floor(Math.random() * 3), // Mock
          totalDuration: Math.floor(Math.random() * 120), // Mock
          workoutTypes: ['Musculação', 'Cardio'], // Mock
        });
      }

      // Calcular estatísticas de check-in
      const totalCheckIns = await this.prisma.gymCheckIn.count({
        where: { userId },
      });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCheckIns = await this.prisma.gymCheckIn.count({
        where: {
          userId,
          checkInAt: {
            gte: startOfMonth,
          },
        },
      });

      // Calcular dias consecutivos de check-in (simplificado)
      const consecutiveCheckInDays = Math.floor(Math.random() * 10); // Mock

      return {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        age,
        createdAt: user.createdAt,
        activeGoal,
        weeklyWorkouts,
        totalCheckIns,
        monthlyCheckIns,
        consecutiveCheckInDays,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar perfil do usuário: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar perfil do usuário');
    }
  }

  async getTrainerProfile(trainerId: string): Promise<TrainerProfileDto> {
    try {
      const trainer = await this.prisma.trainer.findUnique({
        where: { id: trainerId },
        include: {
          user: true,
          services: true,
          schedules: {
            where: {
              isAvailable: true,
              date: {
                gte: new Date(),
              },
            },
            orderBy: { date: 'asc' },
          },
          contracts: {
            where: {
              status: ContractStatus.ACTIVE,
            },
          },
        },
      });

      if (!trainer) {
        throw new NotFoundException('Personal trainer não encontrado');
      }

      const age = this.calculateAge(trainer.user.birthDate);

      // Calcular clientes mensais
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyClients = await this.prisma.contract.count({
        where: {
          trainerId,
          status: ContractStatus.ACTIVE,
          startDate: {
            lte: startOfMonth,
          },
        },
      });

      // Calcular renda mensal
      const monthlyRevenue = await this.prisma.contract.aggregate({
        where: {
          trainerId,
          status: ContractStatus.ACTIVE,
          startDate: {
            lte: startOfMonth,
          },
        },
        _sum: {
          totalPrice: true,
        },
      });

      return {
        id: trainer.id,
        fullName: trainer.user.fullName,
        username: trainer.user.username,
        email: trainer.user.email,
        gender: trainer.user.gender,
        birthDate: trainer.user.birthDate,
        age,
        cref: trainer.cref,
        createdAt: trainer.createdAt,
        monthlyClients,
        monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
        availableSchedules: trainer.schedules.map(schedule => ({
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isAvailable: schedule.isAvailable,
        })),
        services: trainer.services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
        })),
        averageRating: 4.5, // TODO: Implementar sistema de avaliações
        totalRatings: 25, // TODO: Implementar sistema de avaliações
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar perfil do trainer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar perfil do trainer');
    }
  }

  async getUserAnalytics(userId: string): Promise<UserAnalyticsDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Evolução do peso (mock por enquanto)
      const weightEvolution: Array<{
        date: Date;
        weight: number;
        bmi: number;
      }> = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        weightEvolution.push({
          date,
          weight: 80 - (i * 0.5), // Mock
          bmi: 25.5 - (i * 0.1), // Mock
        });
      }

      // Progresso dos treinos (mock por enquanto)
      const workoutProgress: Array<{
        date: Date;
        workoutsCompleted: number;
        totalDuration: number;
        caloriesBurned: number;
      }> = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        workoutProgress.push({
          date,
          workoutsCompleted: Math.floor(Math.random() * 3),
          totalDuration: Math.floor(Math.random() * 120),
          caloriesBurned: Math.floor(Math.random() * 500),
        });
      }

      // Frequência de check-ins
      const totalCheckIns = await this.prisma.gymCheckIn.count({
        where: { userId },
      });

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const weeklyCheckIns = await this.prisma.gymCheckIn.count({
        where: {
          userId,
          checkInAt: {
            gte: startOfWeek,
          },
        },
      });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCheckIns = await this.prisma.gymCheckIn.count({
        where: {
          userId,
          checkInAt: {
            gte: startOfMonth,
          },
        },
      });

      const dailyCheckIns = Math.floor(weeklyCheckIns / 7);

      // Metas
      const goalsAchieved = await this.prisma.userGoal.count({
        where: {
          userId,
          deadline: {
            lt: new Date(),
          },
        },
      });

      const goalsInProgress = await this.prisma.userGoal.count({
        where: {
          userId,
          deadline: {
            gte: new Date(),
          },
        },
      });

      return {
        id: user.id,
        fullName: user.fullName,
        weightEvolution,
        workoutProgress,
        checkInFrequency: {
          daily: dailyCheckIns,
          weekly: weeklyCheckIns,
          monthly: monthlyCheckIns,
          total: totalCheckIns,
        },
        goalsAchieved,
        goalsInProgress,
        averageWorkoutDuration: 45, // Mock
        activeDaysLastMonth: Math.floor(Math.random() * 20) + 10, // Mock
        currentStreak: Math.floor(Math.random() * 15) + 1, // Mock
        bestStreak: Math.floor(Math.random() * 30) + 10, // Mock
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar análises do usuário: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar análises do usuário');
    }
  }

  async getTrainerAnalytics(trainerId: string): Promise<TrainerAnalyticsDto> {
    try {
      const trainer = await this.prisma.trainer.findUnique({
        where: { id: trainerId },
        include: {
          user: true,
        },
      });

      if (!trainer) {
        throw new NotFoundException('Personal trainer não encontrado');
      }

      // Clientes ativos
      const activeClients = await this.prisma.contract.count({
        where: {
          trainerId,
          status: ContractStatus.ACTIVE,
        },
      });

      // Total de clientes
      const totalClients = await this.prisma.contract.count({
        where: { trainerId },
      });

      // Renda mensal
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyRevenue = await this.prisma.contract.aggregate({
        where: {
          trainerId,
          status: ContractStatus.ACTIVE,
          startDate: {
            lte: startOfMonth,
          },
        },
        _sum: {
          totalPrice: true,
        },
      });

      // Renda total
      const totalRevenue = await this.prisma.contract.aggregate({
        where: { trainerId },
        _sum: {
          totalPrice: true,
        },
      });

      // Contratos por status
      const pendingContracts = await this.prisma.contract.count({
        where: {
          trainerId,
          status: ContractStatus.PENDING,
        },
      });

      const completedContracts = await this.prisma.contract.count({
        where: {
          trainerId,
          status: ContractStatus.COMPLETED,
        },
      });

      return {
        id: trainer.id,
        fullName: trainer.user.fullName,
        cref: trainer.cref,
        activeClients,
        totalClients,
        monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        pendingContracts,
        activeContracts: activeClients,
        completedContracts,
        averageRating: 4.5, // TODO: Implementar sistema de avaliações
        totalRatings: 25, // TODO: Implementar sistema de avaliações
        createdAt: trainer.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar análises do trainer: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar análises do trainer');
    }
  }
}
