import { ApiProperty } from '@nestjs/swagger';
import { GoalType, ActivityLevel, ExperienceLevel } from '@prisma/client';

export class GoalViewDto {
  @ApiProperty({ description: 'ID do objetivo' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: GoalType,
  })
  goalType: GoalType;

  @ApiProperty({ description: 'Peso atual em kg' })
  currentWeight: number;

  @ApiProperty({ description: 'Peso desejado em kg' })
  targetWeight: number;

  @ApiProperty({ description: 'Altura em cm' })
  height: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: ActivityLevel,
  })
  activityLevel: ActivityLevel;

  @ApiProperty({ description: 'Prazo para atingir a meta' })
  deadline: Date;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    enum: ExperienceLevel,
  })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'IMC atual calculado' })
  currentBMI: number;

  @ApiProperty({ description: 'IMC alvo calculado' })
  targetBMI: number;

  @ApiProperty({ description: 'Peso a perder/ganhar em kg' })
  weightDifference: number;

  @ApiProperty({ description: 'Dias restantes para o prazo (null se sem prazo)' })
  daysRemaining: number | null;

  @ApiProperty({ description: 'Progresso percentual do objetivo (0-100)' })
  progress: number;

  @ApiProperty({ description: 'Se o objetivo está ativo' })
  isActive: boolean;
}
