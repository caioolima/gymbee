import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { GoalType, ActivityLevel, ExperienceLevel } from '@prisma/client';

export class TestGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: GoalType,
    example: 'GAIN_MASS',
  })
  @IsEnum(GoalType, { message: 'Tipo de objetivo inválido' })
  goalType: GoalType;

  @ApiProperty({
    description: 'Peso atual em kg',
    example: 70,
    minimum: 30,
    maximum: 300,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Peso atual deve ser um número' })
  @Min(30, { message: 'Peso atual deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso atual deve ser no máximo 300kg' })
  currentWeight: number;

  @ApiProperty({
    description: 'Peso desejado em kg',
    example: 75,
    minimum: 30,
    maximum: 300,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Peso desejado deve ser um número' })
  @Min(30, { message: 'Peso desejado deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso desejado deve ser no máximo 300kg' })
  targetWeight: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 170,
    minimum: 100,
    maximum: 250,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura deve ser pelo menos 100cm' })
  @Max(250, { message: 'Altura deve ser no máximo 250cm' })
  height: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: ActivityLevel,
    example: 'MODERATE',
  })
  @IsEnum(ActivityLevel, { message: 'Nível de atividade inválido' })
  activityLevel: ActivityLevel;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    enum: ExperienceLevel,
    example: 'INTERMEDIATE',
  })
  @IsEnum(ExperienceLevel, { message: 'Nível de experiência inválido' })
  experienceLevel: ExperienceLevel;

  @ApiProperty({
    description: 'Prazo para atingir a meta (formato ISO 8601)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  deadline?: string;
}
