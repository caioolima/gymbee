import { ApiProperty } from '@nestjs/swagger';
import { SwipeAction, ContractStatus } from '@prisma/client';

export class ServiceViewDto {
  @ApiProperty({ description: 'ID do serviço' })
  id: string;

  @ApiProperty({ description: 'Nome do serviço' })
  name: string;

  @ApiProperty({ description: 'Descrição do serviço' })
  description: string;

  @ApiProperty({ description: 'Preço do serviço' })
  price: number;

  @ApiProperty({ description: 'Duração em minutos' })
  duration: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class ScheduleViewDto {
  @ApiProperty({ description: 'ID do agendamento' })
  id: string;

  @ApiProperty({ description: 'Data do agendamento' })
  date: Date;

  @ApiProperty({ description: 'Horário de início' })
  startTime: string;

  @ApiProperty({ description: 'Horário de fim' })
  endTime: string;

  @ApiProperty({ description: 'Se está disponível' })
  isAvailable: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class TrainerProfileDto {
  @ApiProperty({ description: 'ID do trainer' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'CREF do trainer' })
  cref: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Gênero' })
  gender: string;

  @ApiProperty({ description: 'Data de nascimento' })
  birthDate: Date;

  @ApiProperty({ description: 'Idade calculada' })
  age: number;

  @ApiProperty({ description: 'Serviços ofertados', type: [ServiceViewDto] })
  services: ServiceViewDto[];

  @ApiProperty({ description: 'Horários disponíveis', type: [ScheduleViewDto] })
  schedules: ScheduleViewDto[];

  @ApiProperty({ description: 'Número de clientes ativos' })
  activeClients: number;

  @ApiProperty({ description: 'Avaliação média' })
  averageRating: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class TrainerCardDto {
  @ApiProperty({ description: 'ID do trainer' })
  id: string;

  @ApiProperty({ description: 'Nome completo' })
  fullName: string;

  @ApiProperty({ description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ description: 'Gênero' })
  gender: string;

  @ApiProperty({ description: 'Idade calculada' })
  age: number;

  @ApiProperty({ description: 'CREF' })
  cref: string;

  @ApiProperty({ description: 'Serviços ofertados', type: [ServiceViewDto] })
  services: ServiceViewDto[];

  @ApiProperty({ description: 'Avaliação média' })
  averageRating: number;

  @ApiProperty({ description: 'Distância em km (se localização fornecida)' })
  distance?: number;
}

export class SwipeResponseDto {
  @ApiProperty({ description: 'ID do swipe' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'ID do trainer' })
  trainerId: string;

  @ApiProperty({ description: 'Ação realizada', enum: SwipeAction })
  action: SwipeAction;

  @ApiProperty({ description: 'Data do swipe' })
  createdAt: Date;

  @ApiProperty({ description: 'Mensagem de resposta' })
  message: string;
}

export class ContractViewDto {
  @ApiProperty({ description: 'ID do contrato' })
  id: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'ID do trainer' })
  trainerId: string;

  @ApiProperty({ description: 'ID do serviço' })
  serviceId: string;

  @ApiProperty({ description: 'Status do contrato', enum: ContractStatus })
  status: ContractStatus;

  @ApiProperty({ description: 'Data de início' })
  startDate: Date;

  @ApiProperty({ description: 'Data de fim' })
  endDate: Date;

  @ApiProperty({ description: 'Preço total' })
  totalPrice: number;

  @ApiProperty({ description: 'Nome do serviço' })
  serviceName: string;

  @ApiProperty({ description: 'Nome do trainer' })
  trainerName: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
}
