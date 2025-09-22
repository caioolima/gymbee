import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export enum WorkoutType {
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  MIXED = 'MIXED',
}

export class CreateWorkoutDto {
  @ApiProperty({ 
    enum: WorkoutType, 
    description: 'Tipo do treino',
    example: 'STRENGTH'
  })
  @IsEnum(WorkoutType)
  type: WorkoutType;

  @ApiProperty({ 
    description: 'Nome do treino',
    example: 'Treino de Peito e Tríceps'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Descrição do treino',
    example: 'Treino focado em peito e tríceps',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Duração do treino em minutos',
    example: 60,
    minimum: 1,
    maximum: 300
  })
  @IsNumber()
  @Min(1)
  @Max(300)
  duration: number;

  @ApiProperty({ 
    description: 'Calorias queimadas estimadas',
    example: 400,
    required: false,
    minimum: 0,
    maximum: 2000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2000)
  calories?: number;

  @ApiProperty({ 
    description: 'Lista de exercícios em JSON',
    example: '[{"name": "Supino", "sets": 3, "reps": 12}]',
    required: false
  })
  @IsOptional()
  exercises?: any;

  @ApiProperty({
    description: 'Observações do usuário',
    example: 'Treino muito bom, senti bastante queima',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Data agendada para o treino',
    example: '2024-01-15T10:00:00Z',
    required: false
  })
  @IsOptional()
  scheduledDate?: Date;

  @ApiProperty({
    description: 'Origem do treino',
    example: 'template',
    enum: ['template', 'user-created'],
    required: false
  })
  @IsOptional()
  @IsString()
  source?: string;
}
