import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CheckInDto {
  @ApiProperty({
    description: 'ID da academia',
    example: 'uuid-da-academia',
  })
  @IsString({ message: 'ID da academia deve ser uma string' })
  @IsNotEmpty({ message: 'ID da academia é obrigatório' })
  gymId: string;
}

export class CheckInResponseDto {
  @ApiProperty({ description: 'ID do check-in' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'ID da academia' })
  gymId: string;

  @ApiProperty({ description: 'Nome da academia' })
  gymName: string;

  @ApiProperty({ description: 'Data e hora do check-in' })
  checkInAt: Date;

  @ApiProperty({ description: 'Mensagem de sucesso' })
  message: string;
}
