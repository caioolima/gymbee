import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AchievementViewDto } from './dto/AchievementViewDTO';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async getUserAchievements(userId: string): Promise<AchievementViewDto[]> {
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });

    return achievements.map(achievement => this.mapToViewDto(achievement));
  }

  async getAchievementCount(userId: string): Promise<number> {
    return this.prisma.userAchievement.count({
      where: { userId },
    });
  }

  async createAchievement(
    userId: string,
    type: string,
    title: string,
    description: string,
    icon?: string,
    metadata?: any
  ): Promise<AchievementViewDto> {
    // Verificar se o usuário já tem esta conquista
    const existingAchievement = await this.prisma.userAchievement.findFirst({
      where: {
        userId,
        type: type as any,
      },
    });

    if (existingAchievement) {
      return this.mapToViewDto(existingAchievement);
    }

    const achievement = await this.prisma.userAchievement.create({
      data: {
        userId,
        type: type as any,
        title,
        description,
        icon,
        metadata,
      },
    });

    return this.mapToViewDto(achievement);
  }

  async markAsRead(userId: string, achievementId: string): Promise<void> {
    await this.prisma.userAchievement.updateMany({
      where: {
        id: achievementId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async checkAndCreateAchievements(userId: string): Promise<void> {
    // Verificar conquistas baseadas em treinos
    await this.checkWorkoutAchievements(userId);
    
    // Verificar conquistas baseadas em consistência
    await this.checkConsistencyAchievements(userId);
  }

  private async checkWorkoutAchievements(userId: string): Promise<void> {
    // Primeiro treino
    const workoutCount = await this.prisma.workout.count({
      where: { userId },
    });

    if (workoutCount === 1) {
      await this.createAchievement(
        userId,
        'FIRST_WORKOUT',
        'Primeiro Treino!',
        'Parabéns! Você completou seu primeiro treino.',
        'Trophy',
        { workoutCount: 1 }
      );
    }
  }

  private async checkConsistencyAchievements(userId: string): Promise<void> {
    // Verificar sequência de treinos na semana
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyWorkouts = await this.prisma.workout.count({
      where: {
        userId,
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    if (weeklyWorkouts >= 5) {
      await this.createAchievement(
        userId,
        'WEEK_STREAK',
        'Semana Completa!',
        'Você treinou 5 dias nesta semana. Incrível!',
        'Calendar',
        { weeklyWorkouts }
      );
    }
  }

  private mapToViewDto(achievement: any): AchievementViewDto {
    return {
      id: achievement.id,
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: achievement.unlockedAt,
      isRead: achievement.isRead,
      metadata: achievement.metadata,
    };
  }
}
