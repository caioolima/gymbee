import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class StringGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    example: 'GAIN_MASS',
  })
  @IsString({ message: 'Tipo de objetivo deve ser uma string' })
  goalType: string;

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
    example: 'MODERATE',
  })
  @IsString({ message: 'Nível de atividade deve ser uma string' })
  activityLevel: string;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    example: 'INTERMEDIATE',
  })
  @IsString({ message: 'Nível de experiência deve ser uma string' })
  experienceLevel: string;

  @ApiProperty({
    description: 'Prazo para atingir a meta (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  deadline?: string;
}
