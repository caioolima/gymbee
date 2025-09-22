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

  private calculateDaysRemaining(deadline: Date | null): number | null {
    if (!deadline) {
      return null; // Se não há deadline, retorna null para indicar objetivo sem prazo
    }
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  private calculateProgress(currentWeight: number, targetWeight: number, goalType: GoalType): number {
    // Se já atingiu ou ultrapassou a meta, retorna 100%
    if (currentWeight === targetWeight) {
      return 100;
    }
    
    // Para ganho de massa: progresso baseado no quanto já ganhou
    if (goalType === 'GAIN_MASS') {
      // Se o peso atual é maior ou igual ao alvo, meta atingida
      if (currentWeight >= targetWeight) {
        return 100;
      }
      // Para ganho de massa, o progresso é baseado no quanto já ganhou
      // Como não temos o peso inicial, vamos assumir que o progresso é 0% no início
      // e 100% quando atingir o alvo
      const totalWeightToGain = targetWeight - currentWeight;
      if (totalWeightToGain <= 0) {
        return 100; // Meta atingida
      }
      // Progresso baseado na diferença atual vs alvo
      // Quanto mais próximo do alvo, maior o progresso
      // Para ganho de massa: progresso = (peso ganho / peso total a ganhar) * 100
      // Como não temos o peso inicial, vamos usar uma lógica baseada na proximidade do alvo
      const progress = Math.round(((currentWeight / targetWeight) * 100));
      return Math.min(100, Math.max(0, progress));
    }
    
    // Para perda de peso: progresso baseado no quanto já perdeu
    if (goalType === 'LOSE_WEIGHT') {
      // Se o peso atual é menor ou igual ao alvo, meta atingida
      if (currentWeight <= targetWeight) {
        return 100;
      }
      // Para perda de peso, o progresso é baseado no quanto já perdeu
      // Como não temos o peso inicial, vamos assumir que o progresso é 0% no início
      // e 100% quando atingir o alvo
      const totalWeightToLose = currentWeight - targetWeight;
      if (totalWeightToLose <= 0) {
        return 100; // Meta atingida
      }
      // Progresso baseado na diferença atual vs alvo
      // Quanto mais próximo do alvo, maior o progresso
      // Para perda de peso: progresso = (peso perdido / peso total a perder) * 100
      // Como não temos o peso inicial, vamos usar uma lógica baseada na proximidade do alvo
      // Quanto mais próximo do alvo, maior o progresso
      const progress = Math.round(((targetWeight / currentWeight) * 100));
      return Math.min(100, Math.max(0, progress));
    }
    
    // Para outros tipos, calcular baseado na diferença
    const weightDifference = Math.abs(targetWeight - currentWeight);
    const totalWeightToChange = Math.abs(targetWeight - currentWeight);
    
    if (totalWeightToChange === 0) {
      return 100;
    }
    
    const progress = Math.round((1 - (weightDifference / totalWeightToChange)) * 100);
    return Math.min(100, Math.max(0, progress));
  }

  private mapGoalToView(goal: any): GoalViewDto {
    const currentBMI = this.calculateBMI(goal.currentWeight, goal.height);
    const targetBMI = this.calculateBMI(goal.targetWeight, goal.height);
    const weightDifference = goal.targetWeight - goal.currentWeight;
    const daysRemaining = this.calculateDaysRemaining(goal.deadline);
    const progress = this.calculateProgress(goal.currentWeight, goal.targetWeight, goal.goalType);

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
      progress,
      isActive: goal.isActive,
    };
  }

  async createGoal(userId: string, createGoalDto: any): Promise<GoalViewDto> {
    try {
      // Verificar se o usuário já tem um objetivo ativo
      const existingGoal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          isActive: true,
        },
      });

      if (existingGoal) {
        throw new ConflictException('Usuário já possui um objetivo ativo');
      }

      // Validar se o prazo é futuro (se fornecido)
      let deadline: Date | undefined;
      if (createGoalDto.deadline) {
        deadline = new Date(createGoalDto.deadline);
        if (deadline <= new Date()) {
          throw new BadRequestException('Prazo deve ser uma data futura');
        }
      }

      // Validar se o peso alvo é diferente do atual
      if (createGoalDto.currentWeight === createGoalDto.targetWeight) {
        throw new BadRequestException('Peso alvo deve ser diferente do peso atual');
      }

      const goalData: any = {
        userId,
        goalType: createGoalDto.goalType as GoalType,
        currentWeight: createGoalDto.currentWeight,
        targetWeight: createGoalDto.targetWeight,
        height: createGoalDto.height,
        activityLevel: createGoalDto.activityLevel as ActivityLevel,
        experienceLevel: createGoalDto.experienceLevel as ExperienceLevel,
      };

      // Só incluir deadline se foi fornecido
      if (deadline) {
        goalData.deadline = deadline;
      }

      const goal = await this.prisma.userGoal.create({
        data: goalData,
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

  async getActiveGoal(userId: string): Promise<GoalViewDto> {
    try {
      const goal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!goal) {
        throw new NotFoundException('Nenhum objetivo ativo encontrado');
      }

      return this.mapGoalToView(goal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      const targetWeight = updateGoalDto.targetWeight ?? existingGoal.targetWeight;
      
      if (existingGoal.currentWeight === targetWeight) {
        throw new BadRequestException('Peso alvo deve ser diferente do peso atual');
      }

      const updateData: any = {};
      
      if (updateGoalDto.goalType) {
        updateData.goalType = updateGoalDto.goalType as GoalType;
      }
      
      if (updateGoalDto.currentWeight) {
        updateData.currentWeight = updateGoalDto.currentWeight;
      }
      
      if (updateGoalDto.targetWeight) {
        updateData.targetWeight = updateGoalDto.targetWeight;
      }
      
      if (updateGoalDto.deadline) {
        updateData.deadline = new Date(updateGoalDto.deadline);
      }

      const updatedGoal = await this.prisma.userGoal.update({
        where: { id: goalId },
        data: updateData,
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

  async toggleGoalActive(userId: string, goalId: string): Promise<GoalViewDto> {
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

      // Se estiver ativando, desativar todos os outros objetivos do usuário
      if (!existingGoal.isActive) {
        await this.prisma.userGoal.updateMany({
          where: {
            userId,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });
      }

      // Atualizar o status do objetivo
      const updatedGoal = await this.prisma.userGoal.update({
        where: { id: goalId },
        data: {
          isActive: !existingGoal.isActive,
        },
      });

      this.logger.log(`Objetivo ${goalId} ${updatedGoal.isActive ? 'ativado' : 'desativado'}`);
      return this.mapGoalToView(updatedGoal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao alterar status do objetivo: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao alterar status do objetivo, tente novamente mais tarde');
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
