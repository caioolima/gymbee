import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExerciseDto {
  @ApiProperty({ description: 'Nome do exercício', example: 'Supino reto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Descrição do exercício', example: 'Exercício para peitoral', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Número de séries', example: 3, required: false })
  @IsOptional()
  @IsNumber()
  sets?: number;

  @ApiProperty({ description: 'Número de repetições', example: 12, required: false })
  @IsOptional()
  @IsNumber()
  reps?: number;

  @ApiProperty({ description: 'Peso utilizado (em kg)', example: 60, required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;
}

export class UpdateWorkoutDto {
  @ApiProperty({ description: 'Nome do treino', example: 'Treino de Peito', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Descrição do treino', example: 'Treino focado no desenvolvimento do peitoral', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Duração do treino em minutos', example: 60, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: 'Calorias queimadas', example: 300, required: false })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiProperty({ 
    description: 'Tipo do treino', 
    example: 'strength',
    enum: ['strength', 'cardio', 'flexibility', 'mixed'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['strength', 'cardio', 'flexibility', 'mixed'])
  type?: string;

  @ApiProperty({ 
    description: 'Data e hora agendada para o treino', 
    example: '2024-01-15T10:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsString()
  scheduledDate?: string;

  @ApiProperty({ 
    description: 'Lista de exercícios do treino', 
    type: [UpdateExerciseDto],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExerciseDto)
  exercises?: UpdateExerciseDto[];
}

