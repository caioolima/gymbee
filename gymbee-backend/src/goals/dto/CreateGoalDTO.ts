import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    example: 'GAIN_MASS',
  })
  goalType: string;

  @ApiProperty({
    description: 'Peso atual em kg',
    example: 80.5,
  })
  currentWeight: number;

  @ApiProperty({
    description: 'Peso desejado em kg',
    example: 75.0,
  })
  targetWeight: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 175,
  })
  height: number;

  @ApiProperty({
    description: 'Nível de atividade física',
    example: 'MODERATE',
  })
  activityLevel: string;

  @ApiProperty({
    description: 'Prazo para atingir a meta (formato ISO 8601)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  deadline?: string;

  @ApiProperty({
    description: 'Nível de experiência com treino',
    example: 'INTERMEDIATE',
  })
  experienceLevel: string;
}

export class UpdateGoalDto {
  @ApiProperty({
    description: 'Tipo de objetivo do usuário',
    enum: ['LOSE_WEIGHT', 'GAIN_MASS', 'IMPROVE_CONDITIONING'],
    required: false,
  })
  goalType?: string;

  @ApiProperty({
    description: 'Peso atual em kg',
    required: false,
  })
  currentWeight?: number;

  @ApiProperty({
    description: 'Peso alvo em kg',
    required: false,
  })
  targetWeight?: number;

  @ApiProperty({
    description: 'Prazo para atingir a meta (formato ISO 8601)',
    required: false,
  })
  deadline?: string;
}