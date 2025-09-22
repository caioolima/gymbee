import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GoalType } from '@prisma/client';

@Injectable()
export class DailyChallengesService {
  private readonly logger = new Logger(DailyChallengesService.name);

  constructor(private prisma: PrismaService) {}

  async getTodaysChallenge(userId: string): Promise<any> {
    try {
      // Buscar objetivo ativo do usuário
      const activeGoal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          isActive: true,
        } as any,
      });

      if (!activeGoal) {
        throw new NotFoundException('Nenhum objetivo ativo encontrado');
      }

      // Verificar se já existe um desafio diário para hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingChallenge = await (this.prisma as any).dailyChallenge.findFirst({
        where: {
          userId,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          challenge: true,
        },
      });

      if (existingChallenge) {
        // Verificar se o desafio é do dia atual
        const challengeDate = new Date(existingChallenge.date);
        const isToday = challengeDate.toDateString() === today.toDateString();
        
        if (!isToday) {
          // Desafio é de um dia anterior, gerar novo para hoje
          this.logger.log(`Desafio de dia anterior encontrado, gerando novo para hoje para usuário ${userId}`);
          await (this.prisma as any).dailyChallenge.delete({
            where: { id: existingChallenge.id }
          });
          const dailyChallenge = await this.generateDailyChallenge(userId, activeGoal.goalType);
          this.logger.log(`Novo desafio diário gerado para usuário ${userId}: ${dailyChallenge.challenge.title}`);
          return dailyChallenge;
        }
        
        // Se o desafio foi completado, retornar o mesmo (não gerar novo no mesmo dia)
        if (existingChallenge.isCompleted) {
          this.logger.log(`Desafio completado encontrado para usuário ${userId}: ${existingChallenge.challenge.title}`);
          return this.mapDailyChallengeToView(existingChallenge);
        }
        
        // Se o desafio foi criado hoje, retornar o mesmo (não gerar novo)
        // Independente se foi aceito ou não, manter o mesmo desafio do dia
        this.logger.log(`Desafio do dia já existe para usuário ${userId}: ${existingChallenge.challenge.title}`);
        return this.mapDailyChallengeToView(existingChallenge);
      }

      // Gerar novo desafio diário baseado no objetivo
      const dailyChallenge = await this.generateDailyChallenge(userId, activeGoal.goalType);
      
      this.logger.log(`Desafio diário gerado para usuário ${userId}: ${dailyChallenge.challenge.title}`);
      return dailyChallenge;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar desafio diário: ${error.message}`, error.stack);
      throw new Error('Erro ao buscar desafio diário, tente novamente mais tarde');
    }
  }

  async acceptDailyChallenge(userId: string, challengeId: string): Promise<any> {
    try {
      const dailyChallenge = await (this.prisma as any).dailyChallenge.findFirst({
        where: {
          id: challengeId,
          userId,
        },
        include: {
          challenge: true,
        },
      });

      if (!dailyChallenge) {
        throw new NotFoundException('Desafio diário não encontrado');
      }

      if (dailyChallenge.isAccepted) {
        throw new Error('Desafio já foi aceito');
      }

      if (dailyChallenge.isCompleted) {
        throw new Error('Desafio já foi completado');
      }

      // Marcar como aceito
      const updatedChallenge = await (this.prisma as any).dailyChallenge.update({
        where: { id: challengeId },
        data: {
          isAccepted: true,
        },
        include: {
          challenge: true,
        },
      });

      // Criar treinos automaticamente se for um desafio de treino
      let createdWorkouts: any[] = [];
      if (this.isWorkoutChallenge(updatedChallenge.challenge.title)) {
        createdWorkouts = await this.createWorkoutsForDailyChallenge(
          userId, 
          updatedChallenge.challenge.title
        );
      }

      this.logger.log(`Desafio diário aceito: ${updatedChallenge.challenge.title}`);
      return {
        ...this.mapDailyChallengeToView(updatedChallenge),
        createdWorkouts: createdWorkouts.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao aceitar desafio diário: ${error.message}`, error.stack);
      throw new Error('Erro ao aceitar desafio diário, tente novamente mais tarde');
    }
  }

  async completeDailyChallenge(userId: string, challengeId: string): Promise<any> {
    try {
      const dailyChallenge = await (this.prisma as any).dailyChallenge.findFirst({
        where: {
          id: challengeId,
          userId,
        },
        include: {
          challenge: true,
        },
      });

      if (!dailyChallenge) {
        throw new NotFoundException('Desafio diário não encontrado');
      }

      if (!dailyChallenge.isAccepted) {
        throw new Error('Desafio deve ser aceito antes de ser completado');
      }

      if (dailyChallenge.isCompleted) {
        throw new Error('Desafio já foi completado');
      }

      // Marcar como completado
      const updatedChallenge = await (this.prisma as any).dailyChallenge.update({
        where: { id: challengeId },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
        include: {
          challenge: true,
        },
      });

      // Criar treinos automaticamente se for um desafio de treino
      let createdWorkouts: any[] = [];
      if (this.isWorkoutChallenge(updatedChallenge.challenge.title)) {
        createdWorkouts = await this.createWorkoutsForDailyChallenge(
          userId, 
          updatedChallenge.challenge.title
        );
        
        // Marcar os treinos criados como completados
        if (createdWorkouts.length > 0) {
          const workoutIds = createdWorkouts.map(workout => workout.id);
          await this.prisma.workout.updateMany({
            where: {
              id: { in: workoutIds },
            },
            data: {
              isCompleted: true,
              completedAt: new Date(),
            },
          });
        }
      }

      this.logger.log(`Desafio diário completado: ${updatedChallenge.challenge.title}`);
      return {
        ...this.mapDailyChallengeToView(updatedChallenge),
        createdWorkouts: createdWorkouts.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao completar desafio diário: ${error.message}`, error.stack);
      throw new Error('Erro ao completar desafio diário, tente novamente mais tarde');
    }
  }

  private async generateDailyChallenge(userId: string, goalType: GoalType): Promise<any> {
    // Buscar objetivo ativo com nível de experiência
    const activeGoal = await this.prisma.userGoal.findFirst({
      where: {
        userId,
        isActive: true,
      } as any,
    });

    if (!activeGoal) {
      throw new Error('Nenhum objetivo ativo encontrado');
    }

    // Usar o nível de experiência diretamente do banco
    const userExperienceLevel = activeGoal.experienceLevel;
    this.logger.log(`Nível de experiência do usuário: ${userExperienceLevel}`);
    
    // Buscar desafios disponíveis para o tipo de objetivo
    const availableChallenges = await this.prisma.challenge.findMany({
      where: {
        goalType,
        isActive: true,
      } as any,
    });

    if (availableChallenges.length === 0) {
      throw new Error('Nenhum desafio disponível para este objetivo');
    }

    // Filtrar desafios baseados no nível de experiência do usuário
    const filteredChallenges = this.filterChallengesByExperienceLevel(availableChallenges, userExperienceLevel);

    // Selecionar um desafio aleatório dos filtrados
    const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
    const selectedChallenge = filteredChallenges[randomIndex];

    // Criar desafio diário
      const dailyChallenge = await (this.prisma as any).dailyChallenge.create({
      data: {
        userId,
        challengeId: selectedChallenge.id,
        date: new Date(),
        isCompleted: false,
        completedAt: null,
      },
      include: {
        challenge: true,
      },
    });

    return this.mapDailyChallengeToView(dailyChallenge);
  }

  private async getUserExperience(userId: string, goalType: GoalType): Promise<number> {
    try {
      // Calcular experiência baseada em:
      // 1. Número de treinos completados
      // 2. Tempo desde o início do objetivo
      // 3. Progresso no objetivo atual
      
      const now = new Date();
      
      // 1. Treinos completados nos últimos 30 dias
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      const recentWorkouts = await this.prisma.workout.count({
        where: {
          userId,
          isCompleted: true,
          completedAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // 2. Tempo desde o início do objetivo ativo
      const activeGoal = await this.prisma.userGoal.findFirst({
        where: {
          userId,
          isActive: true,
        } as any,
      });

      const daysSinceGoalStart = activeGoal 
        ? Math.floor((now.getTime() - activeGoal.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // 3. Progresso no objetivo (0-100)
      const goalProgress = activeGoal ? this.calculateGoalProgress(activeGoal) : 0;

      // Calcular pontuação de experiência (0-100) - MAIS CONSERVADOR
      const workoutScore = Math.min(recentWorkouts * 1, 20); // Máximo 20 pontos (mais conservador)
      const timeScore = Math.min(daysSinceGoalStart * 0.2, 20); // Máximo 20 pontos (mais conservador)
      const progressScore = Math.min(goalProgress * 0.2, 20); // Máximo 20 pontos (mais conservador)

      const totalExperience = workoutScore + timeScore + progressScore;
      
      this.logger.log(`Experiência calculada para usuário ${userId}: ${totalExperience} (treinos: ${recentWorkouts}, dias: ${daysSinceGoalStart}, progresso: ${goalProgress}%)`);
      
      return Math.min(Math.max(totalExperience, 0), 100);
    } catch (error) {
      this.logger.error(`Erro ao calcular experiência: ${error.message}`);
      return 0; // Experiência básica em caso de erro
    }
  }

  private calculateGoalProgress(goal: any): number {
    if (!goal.currentWeight || !goal.targetWeight) return 0;
    
    const current = goal.currentWeight;
    const target = goal.targetWeight;
    const initial = goal.initialWeight || current;
    
    if (goal.goalType === 'LOSE_WEIGHT') {
      const totalToLose = initial - target;
      const alreadyLost = initial - current;
      return totalToLose > 0 ? Math.min((alreadyLost / totalToLose) * 100, 100) : 0;
    } else if (goal.goalType === 'GAIN_MASS') {
      const totalToGain = target - initial;
      const alreadyGained = current - initial;
      return totalToGain > 0 ? Math.min((alreadyGained / totalToGain) * 100, 100) : 0;
    }
    
    return 0;
  }

  private filterChallengesByExperienceLevel(challenges: any[], experienceLevel: string): any[] {
    // Filtrar desafios baseados no nível de experiência do banco
    const filteredChallenges = challenges.filter(challenge => {
      const title = challenge.title.toLowerCase();
      
      switch (experienceLevel) {
        case 'BEGINNER':
          // Desafios básicos - exercícios sem peso ou muito leves
          return title.includes('5kg') || 
                 title.includes('10kg') || 
                 title.includes('1 repetição') ||
                 title.includes('2 repetições') ||
                 title.includes('3 repetições') ||
                 title.includes('flexão') ||
                 title.includes('agachamento sem peso') ||
                 title.includes('corpo livre');
                 
        case 'INTERMEDIATE':
          // Desafios intermediários - pesos leves a médios
          return title.includes('15kg') || 
                 title.includes('20kg') || 
                 title.includes('25kg') ||
                 title.includes('30kg') ||
                 title.includes('5 repetições') ||
                 title.includes('8 repetições') ||
                 title.includes('10 repetições') ||
                 title.includes('supino 20kg') ||
                 title.includes('agachamento 30kg');
                 
        case 'ADVANCED':
          // Desafios avançados - pesos médios a altos
          return title.includes('40kg') || 
                 title.includes('50kg') || 
                 title.includes('60kg') ||
                 title.includes('70kg') ||
                 title.includes('80kg') ||
                 title.includes('12 repetições') ||
                 title.includes('15 repetições') ||
                 title.includes('supino 50kg') ||
                 title.includes('agachamento 60kg') ||
                 title.includes('deadlift 60kg') ||
                 title.includes('supino 100kg') ||
                 title.includes('agachamento 150kg') ||
                 title.includes('deadlift 100kg');
                 
        default:
          return true;
      }
    });

    // Se não encontrou desafios para o nível, usar fallback
    if (filteredChallenges.length === 0) {
      this.logger.log(`Nenhum desafio encontrado para nível ${experienceLevel}, usando fallback`);
      
      // Fallback: sempre priorizar desafios mais fáceis se não encontrar adequados
      if (experienceLevel === 'BEGINNER') {
        // Para iniciantes, pegar os desafios mais básicos disponíveis
        return challenges.filter(challenge => {
          const title = challenge.title.toLowerCase();
          return title.includes('5kg') || 
                 title.includes('10kg') || 
                 title.includes('1 repetição') ||
                 title.includes('2 repetições') ||
                 title.includes('3 repetições') ||
                 title.includes('flexão') ||
                 title.includes('agachamento');
        });
      } else {
        // Para outros níveis, usar todos os disponíveis
        return challenges;
      }
    }
    
    return filteredChallenges;
  }

  private filterChallengesByExperience(challenges: any[], experience: number): any[] {
    // Definir níveis de dificuldade baseados na experiência - MAIS REALISTAS
    let difficultyLevel: string;
    
    if (experience < 10) {
      difficultyLevel = 'beginner';
    } else if (experience < 25) {
      difficultyLevel = 'intermediate';
    } else if (experience < 50) {
      difficultyLevel = 'advanced';
    } else {
      difficultyLevel = 'expert';
    }

    // Filtrar desafios baseados no nível de dificuldade
    const filteredChallenges = challenges.filter(challenge => {
      const title = challenge.title.toLowerCase();
      
      switch (difficultyLevel) {
        case 'beginner':
          // Desafios básicos - exercícios sem peso ou muito leves
          return title.includes('5kg') || 
                 title.includes('10kg') || 
                 title.includes('1 repetição') ||
                 title.includes('2 repetições') ||
                 title.includes('3 repetições') ||
                 title.includes('flexão') ||
                 title.includes('agachamento sem peso') ||
                 title.includes('corpo livre');
                 
        case 'intermediate':
          // Desafios intermediários - pesos leves a médios
          return title.includes('15kg') || 
                 title.includes('20kg') || 
                 title.includes('25kg') ||
                 title.includes('30kg') ||
                 title.includes('5 repetições') ||
                 title.includes('8 repetições') ||
                 title.includes('10 repetições') ||
                 title.includes('supino 20kg') ||
                 title.includes('agachamento 30kg');
                 
        case 'advanced':
          // Desafios avançados - pesos médios a altos
          return title.includes('40kg') || 
                 title.includes('50kg') || 
                 title.includes('60kg') ||
                 title.includes('70kg') ||
                 title.includes('12 repetições') ||
                 title.includes('15 repetições') ||
                 title.includes('supino 50kg') ||
                 title.includes('agachamento 60kg') ||
                 title.includes('deadlift 60kg');
                 
        case 'expert':
          // Desafios de expert - pesos altos (só para quem tem MUITA experiência)
          return title.includes('80kg') || 
                 title.includes('90kg') || 
                 title.includes('100kg') ||
                 title.includes('120kg') ||
                 title.includes('150kg') ||
                 title.includes('20 repetições') ||
                 title.includes('supino 100kg') ||
                 title.includes('agachamento 150kg') ||
                 title.includes('deadlift 100kg');
                 
        default:
          return true;
      }
    });

    // Se não encontrou desafios para o nível, usar fallback baseado na experiência
    if (filteredChallenges.length === 0) {
      this.logger.log(`Nenhum desafio encontrado para nível ${difficultyLevel}, usando fallback`);
      
      // Fallback: sempre priorizar desafios mais fáceis se não encontrar adequados
      if (experience < 20) {
        // Para iniciantes, pegar os desafios mais básicos disponíveis
        return challenges.filter(challenge => {
          const title = challenge.title.toLowerCase();
          return title.includes('5kg') || 
                 title.includes('10kg') || 
                 title.includes('1 repetição') ||
                 title.includes('2 repetições') ||
                 title.includes('3 repetições') ||
                 title.includes('flexão') ||
                 title.includes('agachamento');
        });
      } else {
        // Para outros níveis, usar todos os disponíveis
        return challenges;
      }
    }
    
    return filteredChallenges;
  }

  private async createWorkoutsForDailyChallenge(userId: string, challengeTitle: string): Promise<any[]> {
    // Lógica similar ao sistema anterior, mas para desafios diários
    const templates = this.getWorkoutTemplatesForDailyChallenge(challengeTitle);
    
    if (templates.length === 0) {
      return [];
    }

    const createdWorkouts: any[] = [];
    const template = templates[0]; // Usar apenas um template para desafio diário
    
    try {
      const workout = await this.prisma.workout.create({
        data: {
          userId,
          type: template.type as any,
          name: template.name,
          description: template.description,
          duration: template.duration,
          calories: template.calories,
          exercises: template.exercises,
          notes: template.notes,
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
          isCompleted: false,
          completedAt: null,
          source: 'user-created',
        },
      });
      createdWorkouts.push(workout);
    } catch (error) {
      this.logger.error(`Erro ao criar treino: ${error.message}`);
    }

    return createdWorkouts;
  }

  private getWorkoutTemplatesForDailyChallenge(challengeTitle: string): any[] {
    // Templates simplificados para desafios diários
    const templates: Record<string, any[]> = {
      'Treino de Força - Peito e Tríceps': [{
        name: 'Treino Diário - Peito e Tríceps',
        description: 'Complete 3 séries de supino reto, 3 séries de supino inclinado e 3 séries de tríceps testa',
        type: 'STRENGTH',
        duration: 45,
        calories: 350,
        exercises: [
          { name: 'Supino Reto', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Supino Inclinado', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Tríceps Testa', sets: 3, reps: '10-15', weight: 'Peso livre' },
          { name: 'Flexão de Braço', sets: 3, reps: '10-20', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de peito e tríceps'
      }],
      'Treino de Costas e Bíceps': [{
        name: 'Treino Diário - Costas e Bíceps',
        description: 'Execute 4 séries de puxada frontal, 3 séries de remada curvada e 3 séries de rosca bíceps',
        type: 'STRENGTH',
        duration: 50,
        calories: 400,
        exercises: [
          { name: 'Puxada Frontal', sets: 4, reps: '8-12', weight: 'Peso livre' },
          { name: 'Remada Curvada', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Rosca Bíceps', sets: 3, reps: '10-15', weight: 'Peso livre' },
          { name: 'Puxada Alta', sets: 3, reps: '10-12', weight: 'Peso livre' }
        ],
        notes: 'Desafio diário de costas e bíceps'
      }],
      'Treino de Pernas Completo': [{
        name: 'Treino Diário - Pernas',
        description: 'Faça 4 séries de agachamento, 3 séries de leg press e 3 séries de panturrilha em pé',
        type: 'STRENGTH',
        duration: 60,
        calories: 500,
        exercises: [
          { name: 'Agachamento', sets: 4, reps: '10-15', weight: 'Peso livre' },
          { name: 'Leg Press', sets: 3, reps: '12-15', weight: 'Máquina' },
          { name: 'Panturrilha em Pé', sets: 3, reps: '15-20', weight: 'Peso livre' },
          { name: 'Afundo', sets: 3, reps: '10-12', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de pernas completo'
      }],
      'Treino de Ombros e Trapézio': [{
        name: 'Treino Diário - Ombros',
        description: 'Complete 3 séries de desenvolvimento, 3 séries de elevação lateral e 3 séries de encolhimento',
        type: 'STRENGTH',
        duration: 40,
        calories: 300,
        exercises: [
          { name: 'Desenvolvimento', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Elevação Lateral', sets: 3, reps: '10-15', weight: 'Peso livre' },
          { name: 'Encolhimento', sets: 3, reps: '12-15', weight: 'Peso livre' },
          { name: 'Elevação Frontal', sets: 3, reps: '10-12', weight: 'Peso livre' }
        ],
        notes: 'Desafio diário de ombros e trapézio'
      }],
      'Treino Full Body': [{
        name: 'Treino Diário - Full Body',
        description: 'Execute exercícios para todos os grupos musculares principais em uma sessão',
        type: 'STRENGTH',
        duration: 75,
        calories: 600,
        exercises: [
          { name: 'Agachamento', sets: 3, reps: '12-15', weight: 'Peso livre' },
          { name: 'Supino', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Remada', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Desenvolvimento', sets: 3, reps: '8-12', weight: 'Peso livre' },
          { name: 'Prancha', sets: 3, reps: '30-60s', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário full body'
      }],
      'Cardio Intenso - 30 minutos': [{
        name: 'Cardio Diário - Intenso',
        description: 'Mantenha frequência cardíaca elevada por 30 minutos consecutivos',
        type: 'CARDIO',
        duration: 30,
        calories: 400,
        exercises: [
          { name: 'Esteira', sets: 1, reps: '30 min', intensity: 'Alta' },
          { name: 'Burpees', sets: 3, reps: '10-15', intensity: 'Alta' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s', intensity: 'Alta' }
        ],
        notes: 'Desafio diário de cardio intenso'
      }],
      'HIIT - 20 minutos': [{
        name: 'HIIT Diário',
        description: 'Complete 20 minutos de treino intervalado de alta intensidade',
        type: 'CARDIO',
        duration: 20,
        calories: 350,
        exercises: [
          { name: 'Sprint', sets: 8, reps: '30s', intensity: 'Máxima' },
          { name: 'Descanso', sets: 8, reps: '30s', intensity: 'Baixa' },
          { name: 'Jumping Jacks', sets: 4, reps: '45s', intensity: 'Alta' }
        ],
        notes: 'Desafio diário HIIT'
      }],
      'Caminhada Longa': [{
        name: 'Caminhada Diária',
        description: 'Caminhe por 45 minutos em ritmo moderado',
        type: 'CARDIO',
        duration: 45,
        calories: 250,
        exercises: [
          { name: 'Caminhada', sets: 1, reps: '45 min', intensity: 'Moderada' }
        ],
        notes: 'Desafio diário de caminhada'
      }],
      'Treino Funcional': [{
        name: 'Funcional Diário',
        description: 'Complete um circuito funcional de 30 minutos',
        type: 'FUNCTIONAL',
        duration: 30,
        calories: 300,
        exercises: [
          { name: 'Burpees', sets: 3, reps: '10-15', weight: 'Peso corporal' },
          { name: 'Kettlebell Swing', sets: 3, reps: '15-20', weight: 'Kettlebell' },
          { name: 'Prancha', sets: 3, reps: '30-60s', weight: 'Peso corporal' },
          { name: 'Agachamento com Salto', sets: 3, reps: '10-15', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário funcional'
      }],
      'Treino de Resistência': [{
        name: 'Resistência Diária',
        description: 'Complete 3 rounds de exercícios de resistência muscular',
        type: 'ENDURANCE',
        duration: 40,
        calories: 350,
        exercises: [
          { name: 'Flexão de Braço', sets: 3, reps: '15-25', weight: 'Peso corporal' },
          { name: 'Agachamento', sets: 3, reps: '20-30', weight: 'Peso corporal' },
          { name: 'Prancha', sets: 3, reps: '45-60s', weight: 'Peso corporal' },
          { name: 'Lunges', sets: 3, reps: '15-20', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de resistência'
      }],
      'Treino de Flexibilidade': [{
        name: 'Flexibilidade Diária',
        description: 'Dedique 30 minutos para alongamento e mobilidade',
        type: 'FLEXIBILITY',
        duration: 30,
        calories: 100,
        exercises: [
          { name: 'Alongamento de Quadríceps', sets: 1, reps: '30s', weight: 'Peso corporal' },
          { name: 'Alongamento de Panturrilha', sets: 1, reps: '30s', weight: 'Peso corporal' },
          { name: 'Alongamento de Peito', sets: 1, reps: '30s', weight: 'Peso corporal' },
          { name: 'Yoga Flow', sets: 1, reps: '20 min', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de flexibilidade'
      }],
      'Treino de Equilíbrio': [{
        name: 'Equilíbrio Diário',
        description: 'Pratique exercícios de equilíbrio e coordenação por 20 minutos',
        type: 'BALANCE',
        duration: 20,
        calories: 150,
        exercises: [
          { name: 'Prancha Unilateral', sets: 3, reps: '30s', weight: 'Peso corporal' },
          { name: 'Agachamento em Uma Perna', sets: 3, reps: '8-12', weight: 'Peso corporal' },
          { name: 'Caminhada na Ponta dos Pés', sets: 3, reps: '10 passos', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de equilíbrio'
      }],
      'Treino de Core': [{
        name: 'Core Diário',
        description: 'Foque em exercícios de core por 25 minutos',
        type: 'CORE',
        duration: 25,
        calories: 200,
        exercises: [
          { name: 'Prancha', sets: 3, reps: '45-60s', weight: 'Peso corporal' },
          { name: 'Abdominais', sets: 3, reps: '15-25', weight: 'Peso corporal' },
          { name: 'Prancha Lateral', sets: 3, reps: '30s', weight: 'Peso corporal' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s', weight: 'Peso corporal' }
        ],
        notes: 'Desafio diário de core'
      }]
    };

    return templates[challengeTitle] || [];
  }

  private isWorkoutChallenge(challengeTitle: string): boolean {
    const workoutKeywords = ['treino', 'força', 'cardio', 'hiit', 'musculação', 'exercício'];
    return workoutKeywords.some(keyword => 
      challengeTitle.toLowerCase().includes(keyword)
    );
  }

  private mapDailyChallengeToView(dailyChallenge: any): any {
    return {
      id: dailyChallenge.id,
      challenge: {
        id: dailyChallenge.challenge.id,
        title: dailyChallenge.challenge.title,
        description: dailyChallenge.challenge.description,
        points: dailyChallenge.challenge.points,
        goalType: dailyChallenge.challenge.goalType,
        difficulty: dailyChallenge.challenge.difficulty,
        category: dailyChallenge.challenge.category,
        duration: dailyChallenge.challenge.duration,
        type: dailyChallenge.challenge.category, // Mapear category para type para compatibilidade
      },
      date: dailyChallenge.date,
      isAccepted: dailyChallenge.isAccepted,
      isCompleted: dailyChallenge.isCompleted,
      completedAt: dailyChallenge.completedAt,
      createdAt: dailyChallenge.createdAt,
    };
  }
}
