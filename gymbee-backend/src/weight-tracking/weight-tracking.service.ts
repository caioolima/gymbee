import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWeightEntryDto } from './dto/CreateWeightEntryDTO';
import { WeightEntryViewDto } from './dto/WeightEntryViewDTO';

@Injectable()
export class WeightTrackingService {
  constructor(private prisma: PrismaService) {}

  async createWeightEntry(userId: string, createWeightEntryDto: CreateWeightEntryDto): Promise<WeightEntryViewDto> {
    const weightEntry = await this.prisma.weightEntry.create({
      data: {
        userId,
        weight: createWeightEntryDto.weight,
        notes: createWeightEntryDto.notes,
      },
    });

    return this.mapToViewDto(weightEntry);
  }

  async getUserWeightHistory(userId: string, limit: number = 30): Promise<WeightEntryViewDto[]> {
    const weightEntries = await this.prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return weightEntries.map(entry => this.mapToViewDto(entry));
  }

  async getLatestWeight(userId: string): Promise<WeightEntryViewDto | null> {
    const latestEntry = await this.prisma.weightEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return latestEntry ? this.mapToViewDto(latestEntry) : null;
  }

  async calculateProgress(userId: string, goalId: string): Promise<{ progress: number; currentWeight: number; targetWeight: number; weightDifference: number }> {
    // Buscar o objetivo
    const goal = await this.prisma.userGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Objetivo não encontrado');
    }

    // Buscar a última pesagem
    const latestWeight = await this.getLatestWeight(userId);
    
    if (!latestWeight) {
      // Se não há pesagem, usar o peso inicial do objetivo
      return {
        progress: 0,
        currentWeight: goal.currentWeight,
        targetWeight: goal.targetWeight,
        weightDifference: goal.targetWeight - goal.currentWeight,
      };
    }

    const currentWeight = latestWeight.weight;
    const targetWeight = goal.targetWeight;
    const initialWeight = goal.currentWeight;
    const weightDifference = targetWeight - currentWeight;

    // Calcular progresso baseado no tipo de objetivo
    let progress = 0;

    if (goal.goalType === 'LOSE_WEIGHT') {
      // Para perder peso: progresso baseado na perda de peso
      const totalWeightToLose = initialWeight - targetWeight;
      const weightLost = initialWeight - currentWeight;
      progress = totalWeightToLose > 0 ? Math.min((weightLost / totalWeightToLose) * 100, 100) : 0;
    } else if (goal.goalType === 'GAIN_MASS') {
      // Para ganhar massa: progresso baseado no ganho de peso
      const totalWeightToGain = targetWeight - initialWeight;
      const weightGained = currentWeight - initialWeight;
      progress = totalWeightToGain > 0 ? Math.min((weightGained / totalWeightToGain) * 100, 100) : 0;
    } else {
      // Para melhorar condicionamento: progresso baseado no tempo
      const startDate = goal.createdAt;
      const deadline = goal.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const today = new Date();
      
      const totalDays = (deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      progress = Math.min((elapsedDays / totalDays) * 100, 100);
    }

    return {
      progress: Math.max(0, Math.round(progress)),
      currentWeight,
      targetWeight,
      weightDifference: parseFloat(weightDifference.toFixed(1)),
    };
  }

  private mapToViewDto(weightEntry: any): WeightEntryViewDto {
    return {
      id: weightEntry.id,
      weight: weightEntry.weight,
      notes: weightEntry.notes,
      createdAt: weightEntry.createdAt,
    };
  }
}
