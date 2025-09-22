import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/CreateWorkoutDTO';
import { UpdateWorkoutDto } from './dto/UpdateWorkoutDTO';
import { WorkoutViewDto } from './dto/WorkoutViewDTO';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class WorkoutsService {
  constructor(
    private prisma: PrismaService,
    private achievementsService: AchievementsService
  ) {}

  async createWorkout(userId: string, createWorkoutDto: CreateWorkoutDto): Promise<WorkoutViewDto> {
    const workout = await this.prisma.workout.create({
      data: {
        userId,
        type: createWorkoutDto.type as any,
        name: createWorkoutDto.name,
        description: createWorkoutDto.description,
        duration: createWorkoutDto.duration,
        calories: createWorkoutDto.calories,
        exercises: createWorkoutDto.exercises,
        notes: createWorkoutDto.notes,
        scheduledDate: createWorkoutDto.scheduledDate,
        isCompleted: false, // Sempre criar como não realizado
        completedAt: null,
        source: createWorkoutDto.source || 'user-created', // Default para user-created
      },
    });

    // Verificar e criar conquistas automaticamente
    await this.achievementsService.checkAndCreateAchievements(userId);

    return this.mapToViewDto(workout);
  }

  async getUserWorkouts(userId: string, limit: number = 10): Promise<WorkoutViewDto[]> {
    const workouts = await this.prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return workouts.map(workout => this.mapToViewDto(workout));
  }

  async getWeeklyWorkouts(userId: string): Promise<WorkoutViewDto[]> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const workouts = await this.prisma.workout.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return workouts.map(workout => this.mapToViewDto(workout));
  }

  async getWeeklyWorkoutCount(userId: string): Promise<number> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return this.prisma.workout.count({
      where: {
        userId,
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });
  }

  async markWorkoutAsCompleted(userId: string, workoutId: string): Promise<WorkoutViewDto> {
    const workout = await this.prisma.workout.updateMany({
      where: {
        id: workoutId,
        userId,
      },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    if (workout.count === 0) {
      throw new Error('Treino não encontrado ou não pertence ao usuário');
    }

    // Buscar o treino atualizado
    const updatedWorkout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    // Verificar e criar conquistas automaticamente
    await this.achievementsService.checkAndCreateAchievements(userId);

    return this.mapToViewDto(updatedWorkout);
  }

  async updateWorkout(userId: string, workoutId: string, updateWorkoutDto: UpdateWorkoutDto): Promise<WorkoutViewDto> {
    // Verificar se o treino existe e pertence ao usuário
    const existingWorkout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

    if (!existingWorkout) {
      throw new Error('Treino não encontrado ou não pertence ao usuário');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (updateWorkoutDto.name !== undefined) updateData.name = updateWorkoutDto.name;
    if (updateWorkoutDto.description !== undefined) updateData.description = updateWorkoutDto.description;
    if (updateWorkoutDto.duration !== undefined) updateData.duration = updateWorkoutDto.duration;
    if (updateWorkoutDto.calories !== undefined) updateData.calories = updateWorkoutDto.calories;
    if (updateWorkoutDto.type !== undefined) updateData.type = updateWorkoutDto.type;
    if (updateWorkoutDto.scheduledDate !== undefined) updateData.scheduledDate = new Date(updateWorkoutDto.scheduledDate);
    if (updateWorkoutDto.exercises !== undefined) updateData.exercises = updateWorkoutDto.exercises;

    // Atualizar o treino
    const updatedWorkout = await this.prisma.workout.update({
      where: { id: workoutId },
      data: updateData,
    });

    return this.mapToViewDto(updatedWorkout);
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<{ message: string }> {
    // Verificar se o treino existe e pertence ao usuário
    const existingWorkout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

    if (!existingWorkout) {
      throw new Error('Treino não encontrado ou não pertence ao usuário');
    }

    // Excluir o treino
    await this.prisma.workout.delete({
      where: { id: workoutId },
    });

    return { message: 'Treino excluído com sucesso' };
  }

  private mapToViewDto(workout: any): WorkoutViewDto {
    return {
      id: workout.id,
      type: workout.type,
      name: workout.name,
      description: workout.description,
      duration: workout.duration,
      calories: workout.calories,
      exercises: workout.exercises,
      notes: workout.notes,
      scheduledDate: workout.scheduledDate,
      isCompleted: workout.isCompleted,
      completedAt: workout.completedAt,
      source: workout.source,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    };
  }
}
