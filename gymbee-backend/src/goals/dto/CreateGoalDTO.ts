import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsDateString, Min, Max } from 'class-validator';
import { GoalType, ActivityLevel, ExperienceLevel } from '@prisma/client';

export class CreateGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: GoalType,
    example: GoalType.LOSE_WEIGHT,
  })
  @IsEnum(GoalType, { message: 'Tipo de objetivo inválido' })
  goalType: GoalType;

  @ApiProperty({
    description: 'Peso atual em kg',
    example: 80.5,
    minimum: 30,
    maximum: 300,
  })
  @IsNumber({}, { message: 'Peso atual deve ser um número' })
  @Min(30, { message: 'Peso atual deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso atual deve ser no máximo 300kg' })
  currentWeight: number;

  @ApiProperty({
    description: 'Peso desejado em kg',
    example: 70.0,
    minimum: 30,
    maximum: 300,
  })
  @IsNumber({}, { message: 'Peso desejado deve ser um número' })
  @Min(30, { message: 'Peso desejado deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso desejado deve ser no máximo 300kg' })
  targetWeight: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 175.0,
    minimum: 100,
    maximum: 250,
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura deve ser pelo menos 100cm' })
  @Max(250, { message: 'Altura deve ser no máximo 250cm' })
  height: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: ActivityLevel,
    example: ActivityLevel.MODERATE,
  })
  @IsEnum(ActivityLevel, { message: 'Nível de atividade inválido' })
  activityLevel: ActivityLevel;

  @ApiProperty({
    description: 'Prazo para atingir a meta (formato ISO 8601)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString({}, { message: 'Prazo deve ser uma data válida' })
  deadline: string;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    enum: ExperienceLevel,
    example: ExperienceLevel.BEGINNER,
  })
  @IsEnum(ExperienceLevel, { message: 'Nível de experiência inválido' })
  experienceLevel: ExperienceLevel;
}

export class UpdateGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: GoalType,
    example: GoalType.LOSE_WEIGHT,
    required: false,
  })
  @IsEnum(GoalType, { message: 'Tipo de objetivo inválido' })
  goalType?: GoalType;

  @ApiProperty({
    description: 'Peso atual em kg',
    example: 80.5,
    minimum: 30,
    maximum: 300,
    required: false,
  })
  @IsNumber({}, { message: 'Peso atual deve ser um número' })
  @Min(30, { message: 'Peso atual deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso atual deve ser no máximo 300kg' })
  currentWeight?: number;

  @ApiProperty({
    description: 'Peso desejado em kg',
    example: 70.0,
    minimum: 30,
    maximum: 300,
    required: false,
  })
  @IsNumber({}, { message: 'Peso desejado deve ser um número' })
  @Min(30, { message: 'Peso desejado deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso desejado deve ser no máximo 300kg' })
  targetWeight?: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 175.0,
    minimum: 100,
    maximum: 250,
    required: false,
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura deve ser pelo menos 100cm' })
  @Max(250, { message: 'Altura deve ser no máximo 250cm' })
  height?: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: ActivityLevel,
    example: ActivityLevel.MODERATE,
    required: false,
  })
  @IsEnum(ActivityLevel, { message: 'Nível de atividade inválido' })
  activityLevel?: ActivityLevel;

  @ApiProperty({
    description: 'Prazo para atingir a meta (formato ISO 8601)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsDateString({}, { message: 'Prazo deve ser uma data válida' })
  deadline?: string;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    enum: ExperienceLevel,
    example: ExperienceLevel.BEGINNER,
    required: false,
  })
  @IsEnum(ExperienceLevel, { message: 'Nível de experiência inválido' })
  experienceLevel?: ExperienceLevel;
}
