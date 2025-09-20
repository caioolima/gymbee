import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsArray, Min, Max } from 'class-validator';
import { SwipeAction } from '@prisma/client';

export class SwipeTrainerDto {
  @ApiProperty({
    description: 'ID do personal trainer',
    example: 'uuid-do-trainer',
  })
  @IsString({ message: 'ID do trainer deve ser uma string' })
  trainerId: string;

  @ApiProperty({
    description: 'Ação do swipe',
    enum: SwipeAction,
    example: SwipeAction.LIKE,
  })
  @IsEnum(SwipeAction, { message: 'Ação inválida' })
  action: SwipeAction;
}

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Treino Personalizado',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Descrição do serviço',
    example: 'Treino personalizado focado em hipertrofia',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  description: string;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 150.0,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser maior ou igual a zero' })
  price: number;

  @ApiProperty({
    description: 'Duração do serviço em minutos',
    example: 60,
    minimum: 15,
    maximum: 300,
  })
  @IsNumber({}, { message: 'Duração deve ser um número' })
  @Min(15, { message: 'Duração mínima é 15 minutos' })
  @Max(300, { message: 'Duração máxima é 300 minutos' })
  duration: number;
}

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Data do agendamento (formato ISO 8601)',
    example: '2024-12-25T00:00:00.000Z',
  })
  @IsString({ message: 'Data deve ser uma string' })
  date: string;

  @ApiProperty({
    description: 'Horário de início (formato HH:mm)',
    example: '09:00',
  })
  @IsString({ message: 'Horário de início deve ser uma string' })
  startTime: string;

  @ApiProperty({
    description: 'Horário de fim (formato HH:mm)',
    example: '10:00',
  })
  @IsString({ message: 'Horário de fim deve ser uma string' })
  endTime: string;
}

export class CreateContractDto {
  @ApiProperty({
    description: 'ID do serviço',
    example: 'uuid-do-servico',
  })
  @IsString({ message: 'ID do serviço deve ser uma string' })
  serviceId: string;

  @ApiProperty({
    description: 'Data de início do contrato (formato ISO 8601)',
    example: '2024-12-25T00:00:00.000Z',
  })
  @IsString({ message: 'Data de início deve ser uma string' })
  startDate: string;

  @ApiProperty({
    description: 'Data de fim do contrato (formato ISO 8601)',
    example: '2025-01-25T00:00:00.000Z',
  })
  @IsString({ message: 'Data de fim deve ser uma string' })
  endDate: string;
}

export class TrainerFiltersDto {
  @ApiProperty({
    description: 'Latitude para busca por localização',
    example: -23.5505,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  lat?: number;

  @ApiProperty({
    description: 'Longitude para busca por localização',
    example: -46.6333,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  lon?: number;

  @ApiProperty({
    description: 'Raio de busca em km',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Raio deve ser um número' })
  @Min(1, { message: 'Raio mínimo é 1km' })
  @Max(100, { message: 'Raio máximo é 100km' })
  radius?: number;

  @ApiProperty({
    description: 'Gênero do trainer',
    example: 'M',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;

  @ApiProperty({
    description: 'Idade mínima',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Idade mínima deve ser um número' })
  @Min(18, { message: 'Idade mínima é 18 anos' })
  @Max(80, { message: 'Idade máxima é 80 anos' })
  minAge?: number;

  @ApiProperty({
    description: 'Idade máxima',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Idade máxima deve ser um número' })
  @Min(18, { message: 'Idade mínima é 18 anos' })
  @Max(80, { message: 'Idade máxima é 80 anos' })
  maxAge?: number;

  @ApiProperty({
    description: 'Tipos de treino ofertados',
    example: ['Musculação', 'Crossfit'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Tipos de treino deve ser um array' })
  @IsString({ each: true, message: 'Cada tipo de treino deve ser uma string' })
  workoutTypes?: string[];
}
