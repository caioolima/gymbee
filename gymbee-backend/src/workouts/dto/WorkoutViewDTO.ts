import { ApiProperty } from '@nestjs/swagger';

export class WorkoutViewDto {
  @ApiProperty({ description: 'ID do treino' })
  id: string;

  @ApiProperty({ description: 'Tipo do treino' })
  type: string;

  @ApiProperty({ description: 'Nome do treino' })
  name: string;

  @ApiProperty({ description: 'Descrição do treino', required: false })
  description?: string;

  @ApiProperty({ description: 'Duração do treino em minutos' })
  duration: number;

  @ApiProperty({ description: 'Calorias queimadas estimadas', required: false })
  calories?: number;

  @ApiProperty({ description: 'Lista de exercícios', required: false })
  exercises?: any;

  @ApiProperty({ description: 'Observações do usuário', required: false })
  notes?: string;

  @ApiProperty({ description: 'Data agendada para o treino', required: false })
  scheduledDate?: Date;

  @ApiProperty({ description: 'Se o treino foi realizado' })
  isCompleted: boolean;

  @ApiProperty({ description: 'Data em que foi marcado como completo', required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Origem do treino' })
  source: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
