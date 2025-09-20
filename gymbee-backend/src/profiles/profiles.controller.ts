import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UserProfileDto, TrainerProfileDto, UserAnalyticsDto, TrainerAnalyticsDto } from './view/ProfileViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Perfis e Análises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('user')
  @ApiOperation({ summary: 'Buscar perfil completo do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário carregado com sucesso',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getUserProfile(@Request() req: any): Promise<UserProfileDto> {
    return this.profilesService.getUserProfile(req.user.id);
  }

  @Get('user/analytics')
  @ApiOperation({ summary: 'Buscar análises e estatísticas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Análises do usuário carregadas com sucesso',
    type: UserAnalyticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getUserAnalytics(@Request() req: any): Promise<UserAnalyticsDto> {
    return this.profilesService.getUserAnalytics(req.user.id);
  }

  @Get('trainer/:id')
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
    return this.profilesService.getTrainerProfile(trainerId);
  }

  @Get('trainer/:id/analytics')
  @ApiOperation({ summary: 'Buscar análises e estatísticas de um personal trainer' })
  @ApiResponse({
    status: 200,
    description: 'Análises do trainer carregadas com sucesso',
    type: TrainerAnalyticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Personal trainer não encontrado',
  })
  async getTrainerAnalytics(@Param('id') trainerId: string): Promise<TrainerAnalyticsDto> {
    return this.profilesService.getTrainerAnalytics(trainerId);
  }

  @Get('my-trainer-profile')
  @ApiOperation({ summary: 'Buscar perfil do próprio trainer (apenas para trainers)' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do trainer carregado com sucesso',
    type: TrainerProfileDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas trainers podem acessar',
  })
  @ApiResponse({
    status: 404,
    description: 'Personal trainer não encontrado',
  })
  async getMyTrainerProfile(@Request() req: any): Promise<TrainerProfileDto> {
    if (req.user.role !== 'TRAINER') {
      throw new Error('Acesso negado - apenas trainers podem acessar');
    }

    // Assumindo que o trainerId está disponível no token JWT
    const trainerId = req.user.trainerId;
    if (!trainerId) {
      throw new Error('ID do trainer não encontrado no token');
    }

    return this.profilesService.getTrainerProfile(trainerId);
  }

  @Get('my-trainer-analytics')
  @ApiOperation({ summary: 'Buscar análises do próprio trainer (apenas para trainers)' })
  @ApiResponse({
    status: 200,
    description: 'Análises do trainer carregadas com sucesso',
    type: TrainerAnalyticsDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas trainers podem acessar',
  })
  @ApiResponse({
    status: 404,
    description: 'Personal trainer não encontrado',
  })
  async getMyTrainerAnalytics(@Request() req: any): Promise<TrainerAnalyticsDto> {
    if (req.user.role !== 'TRAINER') {
      throw new Error('Acesso negado - apenas trainers podem acessar');
    }

    // Assumindo que o trainerId está disponível no token JWT
    const trainerId = req.user.trainerId;
    if (!trainerId) {
      throw new Error('ID do trainer não encontrado no token');
    }

    return this.profilesService.getTrainerAnalytics(trainerId);
  }
}
