import { ApiProperty } from '@nestjs/swagger';

export class WeightEntryViewDto {
  @ApiProperty({ description: 'ID da entrada de peso' })
  id: string;

  @ApiProperty({ description: 'Peso em kg' })
  weight: number;

  @ApiProperty({ description: 'Observações', required: false })
  notes?: string;

  @ApiProperty({ description: 'Data da pesagem' })
  createdAt: Date;
}
