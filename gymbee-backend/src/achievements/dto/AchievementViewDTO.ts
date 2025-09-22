import { ApiProperty } from '@nestjs/swagger';

export class AchievementViewDto {
  @ApiProperty({ description: 'ID da conquista' })
  id: string;

  @ApiProperty({ description: 'Tipo da conquista' })
  type: string;

  @ApiProperty({ description: 'Título da conquista' })
  title: string;

  @ApiProperty({ description: 'Descrição da conquista' })
  description: string;

  @ApiProperty({ description: 'Ícone da conquista', required: false })
  icon?: string;

  @ApiProperty({ description: 'Data de desbloqueio' })
  unlockedAt: Date;

  @ApiProperty({ description: 'Se a conquista foi lida' })
  isRead: boolean;

  @ApiProperty({ description: 'Metadados da conquista', required: false })
  metadata?: any;
}
