import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TrainersService } from './trainers.service';
import { SwipeTrainerDto, CreateServiceDto, CreateScheduleDto, CreateContractDto, TrainerFiltersDto } from './dto/TrainerDTO';
import { TrainerProfileDto, TrainerCardDto, SwipeResponseDto, ContractViewDto } from './view/TrainerViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Personal Trainers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar personal trainers com filtros (sistema Tinder)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de personal trainers disponíveis',
    type: [TrainerCardDto],
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    description: 'Latitude para busca por localização',
    example: -23.5505,
  })
  @ApiQuery({
    name: 'lon',
    required: false,
    description: 'Longitude para busca por localização',
    example: -46.6333,
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    description: 'Raio de busca em km',
    example: 10,
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    description: 'Gênero do trainer',
    example: 'M',
  })
  @ApiQuery({
    name: 'minAge',
    required: false,
    description: 'Idade mínima',
    example: 25,
  })
  @ApiQuery({
    name: 'maxAge',
    required: false,
    description: 'Idade máxima',
    example: 50,
  })
  @ApiQuery({
    name: 'workoutTypes',
    required: false,
    description: 'Tipos de treino (separados por vírgula)',
    example: 'Musculação,Crossfit',
  })
  async getTrainers(
    @Request() req: any,
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
    @Query('gender') gender?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('workoutTypes') workoutTypes?: string,
  ): Promise<TrainerCardDto[]> {
    const filters: TrainerFiltersDto = {
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
      radius: radius ? parseFloat(radius) : undefined,
      gender,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      workoutTypes: workoutTypes ? workoutTypes.split(',') : undefined,
    };

    return this.trainersService.getTrainers(req.user.id, filters);
  }

  @Post('swipe')
  @ApiOperation({ summary: 'Dar swipe em um personal trainer (like/skip)' })
  @ApiResponse({
    status: 201,
    description: 'Swipe realizado com sucesso',
    type: SwipeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Personal trainer não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já deu swipe neste trainer',
  })
  async swipeTrainer(@Request() req: any, @Body() swipeDto: SwipeTrainerDto): Promise<SwipeResponseDto> {
    return this.trainersService.swipeTrainer(req.user.id, swipeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar perfil completo de um personal trainer' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do trainer carregado com sucesso',
    type: TrainerProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Personal trainer não encontrado',
  })
  async getTrainerProfile(@Param('id') trainerId: string): Promise<TrainerProfileDto> {
    return this.trainersService.getTrainerProfile(trainerId);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Criar um novo serviço (apenas para trainers)' })
  @ApiResponse({
    status: 201,
    description: 'Serviço criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas trainers podem criar serviços',
  })
  async createService(
    @Request() req: any,
    @Param('id') trainerId: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    // Verificar se o usuário é o trainer
    if (req.user.role !== 'TRAINER' || req.user.trainerId !== trainerId) {
      throw new Error('Acesso negado');
    }

    return this.trainersService.createService(trainerId, createServiceDto);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Criar um novo agendamento (apenas para trainers)' })
  @ApiResponse({
    status: 201,
    description: 'Agendamento criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas trainers podem criar agendamentos',
  })
  async createSchedule(
    @Request() req: any,
    @Param('id') trainerId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    // Verificar se o usuário é o trainer
    if (req.user.role !== 'TRAINER' || req.user.trainerId !== trainerId) {
      throw new Error('Acesso negado');
    }

    return this.trainersService.createSchedule(trainerId, createScheduleDto);
  }

  @Post(':id/contract')
  @ApiOperation({ summary: 'Contratar um personal trainer' })
  @ApiResponse({
    status: 201,
    description: 'Contrato criado com sucesso',
    type: ContractViewDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Serviço não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um contrato ativo com este trainer',
  })
  async createContract(
    @Request() req: any,
    @Param('id') trainerId: string,
    @Body() createContractDto: CreateContractDto,
  ): Promise<ContractViewDto> {
    return this.trainersService.createContract(req.user.id, trainerId, createContractDto);
  }

  @Get('contracts/my')
  @ApiOperation({ summary: 'Buscar contratos do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Contratos do usuário carregados com sucesso',
    type: [ContractViewDto],
  })
  async getUserContracts(@Request() req: any): Promise<ContractViewDto[]> {
    return this.trainersService.getUserContracts(req.user.id);
  }
}
