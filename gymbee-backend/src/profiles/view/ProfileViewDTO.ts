import { ApiProperty } from '@nestjs/swagger';
import { GoalType, ActivityLevel, ExperienceLevel, ContractStatus } from '@prisma/client';

export class UserGoalSummaryDto {
  @ApiProperty({ description: 'ID do objetivo' })
  id: string;

  @ApiProperty({ description: 'Tipo de objetivo', enum: GoalType })
  goalType: GoalType;

  @ApiProperty({ description: 'Peso atual em kg' })
  currentWeight: number;

  @ApiProperty({ description: 'Peso desejado em kg' })
  targetWeight: number;

  @ApiProperty({ description: 'Altura em cm' })
  height: number;

  @ApiProperty({ description: 'Nível de atividade', enum: ActivityLevel })
  activityLevel: ActivityLevel;

  @ApiProperty({ description: 'Nível de experiência', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ description: 'Prazo para atingir a meta' })
  deadline: Date;

  @ApiProperty({ description: 'IMC atual' })
  currentBMI: number;

  @ApiProperty({ description: 'IMC alvo' })
  targetBMI: number;

  @ApiProperty({ description: 'Peso a perder/ganhar em kg' })
  weightDifference: number;

  @ApiProperty({ description: 'Dias restantes' })
  daysRemaining: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class WeeklyWorkoutDto {
  @ApiProperty({ description: 'Dia da semana (0-6)' })
  dayOfWeek: number;

  @ApiProperty({ description: 'Nome do dia' })
  dayName: string;

  @ApiProperty({ description: 'Número de treinos' })
  workoutCount: number;

  @ApiProperty({ description: 'Duração total em minutos' })
  totalDuration: number;

  @ApiProperty({ description: 'Tipos de treino realizados' })
  workoutTypes: string[];
}

export class UserProfileDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Gênero' })
  gender: string;

  @ApiProperty({ description: 'Data de nascimento' })
  birthDate: Date;

  @ApiProperty({ description: 'Idade calculada' })
  age: number;

  @ApiProperty({ description: 'Data de criação da conta' })
  createdAt: Date;

  @ApiProperty({ description: 'Objetivo ativo', type: UserGoalSummaryDto, required: false })
  activeGoal?: UserGoalSummaryDto;

  @ApiProperty({ description: 'Treinos da semana', type: [WeeklyWorkoutDto] })
  weeklyWorkouts: WeeklyWorkoutDto[];

  @ApiProperty({ description: 'Total de check-ins' })
  totalCheckIns: number;

  @ApiProperty({ description: 'Check-ins este mês' })
  monthlyCheckIns: number;

  @ApiProperty({ description: 'Dias consecutivos de check-in' })
  consecutiveCheckInDays: number;
}

export class TrainerAnalyticsDto {
  @ApiProperty({ description: 'ID do trainer' })
  id: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ description: 'CREF' })
  cref: string;

  @ApiProperty({ description: 'Número de clientes ativos' })
  activeClients: number;

  @ApiProperty({ description: 'Número total de clientes' })
  totalClients: number;

  @ApiProperty({ description: 'Renda mensal atual' })
  monthlyRevenue: number;

  @ApiProperty({ description: 'Renda total' })
  totalRevenue: number;

  @ApiProperty({ description: 'Contratos pendentes' })
  pendingContracts: number;

  @ApiProperty({ description: 'Contratos ativos' })
  activeContracts: number;

  @ApiProperty({ description: 'Contratos completados' })
  completedContracts: number;

  @ApiProperty({ description: 'Avaliação média' })
  averageRating: number;

  @ApiProperty({ description: 'Total de avaliações' })
  totalRatings: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class UserAnalyticsDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ 
    description: 'Evolução do peso (últimos 6 meses)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date-time' },
        weight: { type: 'number' },
        bmi: { type: 'number' }
      }
    }
  })
  weightEvolution: Array<{
    date: Date;
    weight: number;
    bmi: number;
  }>;

  @ApiProperty({ 
    description: 'Progresso dos treinos (últimos 30 dias)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date-time' },
        workoutsCompleted: { type: 'number' },
        totalDuration: { type: 'number' },
        caloriesBurned: { type: 'number' }
      }
    }
  })
  workoutProgress: Array<{
    date: Date;
    workoutsCompleted: number;
    totalDuration: number;
    caloriesBurned: number;
  }>;

  @ApiProperty({ description: 'Frequência de check-ins' })
  checkInFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };

  @ApiProperty({ description: 'Metas alcançadas' })
  goalsAchieved: number;

  @ApiProperty({ description: 'Metas em andamento' })
  goalsInProgress: number;

  @ApiProperty({ description: 'Tempo médio de treino por sessão' })
  averageWorkoutDuration: number;

  @ApiProperty({ description: 'Dias ativos no último mês' })
  activeDaysLastMonth: number;

  @ApiProperty({ description: 'Streak atual (dias consecutivos)' })
  currentStreak: number;

  @ApiProperty({ description: 'Melhor streak' })
  bestStreak: number;
}

export class TrainerProfileDto {
  @ApiProperty({ description: 'ID do trainer' })
  id: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Gênero' })
  gender: string;

  @ApiProperty({ description: 'Data de nascimento' })
  birthDate: Date;

  @ApiProperty({ description: 'Idade calculada' })
  age: number;

  @ApiProperty({ description: 'CREF' })
  cref: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Número de clientes mensais' })
  monthlyClients: number;

  @ApiProperty({ description: 'Renda mensal obtida' })
  monthlyRevenue: number;

  @ApiProperty({ description: 'Horários disponíveis' })
  availableSchedules: Array<{
    date: Date;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;

  @ApiProperty({ description: 'Lista de serviços ofertados' })
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  }>;

  @ApiProperty({ description: 'Avaliação média' })
  averageRating: number;

  @ApiProperty({ description: 'Total de avaliações' })
  totalRatings: number;
}
