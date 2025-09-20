import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/CreateGoalDTO';
import { GoalViewDto } from './view/GoalViewDTO';
import { GoalType, ActivityLevel, ExperienceLevel } from '@prisma/client';

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  constructor(private prisma: PrismaService) {}

  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  private calculateDaysRemaining(deadline: Date): number {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private mapGoalToView(goal: any): GoalViewDto {
    const currentBMI = this.calculateBMI(goal.currentWeight, goal.height);
    const targetBMI = this.calculateBMI(goal.targetWeight, goal.height);
    const weightDifference = goal.targetWeight - goal.currentWeight;
    const daysRemaining = this.calculateDaysRemaining(goal.deadline);

    return {
      id: goal.id,
      userId: goal.userId,
      goalType: goal.goalType,
      currentWeight: goal.currentWeight,
      targetWeight: goal.targetWeight,
      height: goal.height,
      activityLevel: goal.activityLevel,
      deadline: goal.deadline,
      experienceLevel: goal.experienceLevel,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      currentBMI,
      targetBMI,
      weightDifference,
      daysRemaining,
    };
  }

  async createGoal(userId: string, createGoalDto: CreateGoalDto): Promise<GoalViewDto> {
    try {
      // Verificar se o usuário já tem um objetivo ativo
      const existingGoal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          deadline: {
            gte: new Date(), // Apenas objetivos com prazo futuro
          },
        },
      });

      if (existingGoal) {
        throw new ConflictException('Usuário já possui um objetivo ativo');
      }

      // Validar se o prazo é futuro
      const deadline = new Date(createGoalDto.deadline);
      if (deadline <= new Date()) {
        throw new BadRequestException('Prazo deve ser uma data futura');
      }

      // Validar se o peso alvo é diferente do atual
      if (createGoalDto.currentWeight === createGoalDto.targetWeight) {
        throw new BadRequestException('Peso alvo deve ser diferente do peso atual');
      }

      const goal = await this.prisma.userGoal.create({
        data: {
          userId,
          goalType: createGoalDto.goalType,
          currentWeight: createGoalDto.currentWeight,
          targetWeight: createGoalDto.targetWeight,
          height: createGoalDto.height,
          activityLevel: createGoalDto.activityLevel,
          deadline,
          experienceLevel: createGoalDto.experienceLevel,
        },
      });

      this.logger.log(`Objetivo criado para usuário ${userId}: ${goal.id}`);
      return this.mapGoalToView(goal);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Erro ao criar objetivo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar objetivo, tente novamente mais tarde');
    }
  }

  async getGoals(userId: string): Promise<GoalViewDto[]> {
    try {
      const goals = await this.prisma.userGoal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return goals.map(goal => this.mapGoalToView(goal));
    } catch (error) {
      this.logger.error(`Erro ao buscar objetivos: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar objetivos, tente novamente mais tarde');
    }
  }

  async getActiveGoal(userId: string): Promise<GoalViewDto | null> {
    try {
      const goal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          deadline: {
            gte: new Date(), // Apenas objetivos com prazo futuro
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return goal ? this.mapGoalToView(goal) : null;
    } catch (error) {
      this.logger.error(`Erro ao buscar objetivo ativo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar objetivo ativo, tente novamente mais tarde');
    }
  }

  async updateGoal(userId: string, goalId: string, updateGoalDto: UpdateGoalDto): Promise<GoalViewDto> {
    try {
      // Verificar se o objetivo existe e pertence ao usuário
      const existingGoal = await this.prisma.userGoal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });

      if (!existingGoal) {
        throw new NotFoundException('Objetivo não encontrado');
      }

      // Validar prazo se fornecido
      if (updateGoalDto.deadline) {
        const deadline = new Date(updateGoalDto.deadline);
        if (deadline <= new Date()) {
          throw new BadRequestException('Prazo deve ser uma data futura');
        }
      }

      // Validar pesos se fornecidos
      const currentWeight = updateGoalDto.currentWeight ?? existingGoal.currentWeight;
      const targetWeight = updateGoalDto.targetWeight ?? existingGoal.targetWeight;
      
      if (currentWeight === targetWeight) {
        throw new BadRequestException('Peso alvo deve ser diferente do peso atual');
      }

      const updatedGoal = await this.prisma.userGoal.update({
        where: { id: goalId },
        data: {
          ...updateGoalDto,
          deadline: updateGoalDto.deadline ? new Date(updateGoalDto.deadline) : undefined,
        },
      });

      this.logger.log(`Objetivo atualizado: ${goalId}`);
      return this.mapGoalToView(updatedGoal);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Erro ao atualizar objetivo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar objetivo, tente novamente mais tarde');
    }
  }

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    try {
      // Verificar se o objetivo existe e pertence ao usuário
      const existingGoal = await this.prisma.userGoal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });

      if (!existingGoal) {
        throw new NotFoundException('Objetivo não encontrado');
      }

      await this.prisma.userGoal.delete({
        where: { id: goalId },
      });

      this.logger.log(`Objetivo deletado: ${goalId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao deletar objetivo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao deletar objetivo, tente novamente mais tarde');
    }
  }

  async getGoalById(userId: string, goalId: string): Promise<GoalViewDto> {
    try {
      const goal = await this.prisma.userGoal.findFirst({
        where: {
          id: goalId,
          userId,
        },
      });

      if (!goal) {
        throw new NotFoundException('Objetivo não encontrado');
      }

      return this.mapGoalToView(goal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar objetivo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar objetivo, tente novamente mais tarde');
    }
  }
}
