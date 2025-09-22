import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateWeightEntryDto {
  @ApiProperty({ 
    description: 'Peso em kg',
    example: 75.5,
    minimum: 30,
    maximum: 300
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'weight must be a number conforming to the specified constraints' })
  @Min(30, { message: 'weight must not be less than 30' })
  @Max(300, { message: 'weight must not be greater than 300' })
  weight: number;

  @ApiProperty({ 
    description: 'Observações sobre a pesagem',
    example: 'Pesagem matinal, após o café',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
