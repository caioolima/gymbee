import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum SimpleGoalType {
  LOSE_WEIGHT = 'LOSE_WEIGHT',
  GAIN_MASS = 'GAIN_MASS',
  IMPROVE_CONDITIONING = 'IMPROVE_CONDITIONING',
}

export enum SimpleActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

export enum SimpleExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class SimpleGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: SimpleGoalType,
    example: 'GAIN_MASS',
  })
  @IsEnum(SimpleGoalType, { message: 'Tipo de objetivo inválido' })
  goalType: SimpleGoalType;

  @ApiProperty({
    description: 'Peso atual em kg',
    example: 70,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Peso atual deve ser um número' })
  @Min(30, { message: 'Peso atual deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso atual deve ser no máximo 300kg' })
  currentWeight: number;

  @ApiProperty({
    description: 'Peso desejado em kg',
    example: 75,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Peso desejado deve ser um número' })
  @Min(30, { message: 'Peso desejado deve ser pelo menos 30kg' })
  @Max(300, { message: 'Peso desejado deve ser no máximo 300kg' })
  targetWeight: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 170,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura deve ser pelo menos 100cm' })
  @Max(250, { message: 'Altura deve ser no máximo 250cm' })
  height: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: SimpleActivityLevel,
    example: 'MODERATE',
  })
  @IsEnum(SimpleActivityLevel, { message: 'Nível de atividade inválido' })
  activityLevel: SimpleActivityLevel;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    enum: SimpleExperienceLevel,
    example: 'INTERMEDIATE',
  })
  @IsEnum(SimpleExperienceLevel, { message: 'Nível de experiência inválido' })
  experienceLevel: SimpleExperienceLevel;

  @ApiProperty({
    description: 'Prazo para atingir a meta (opcional)',
    required: false,
  })
  @IsOptional()
  deadline?: string;
}
