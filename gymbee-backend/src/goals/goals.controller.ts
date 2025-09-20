import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/CreateGoalDTO';
import { GoalViewDto } from './view/GoalViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Objetivos do Usuário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo objetivo para o usuário' })
  @ApiResponse({
    status: 201,
    description: 'Objetivo criado com sucesso',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou prazo deve ser futuro',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já possui um objetivo ativo',
  })
  async createGoal(@Request() req: any, @Body() createGoalDto: CreateGoalDto): Promise<GoalViewDto> {
    return this.goalsService.createGoal(req.user.id, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os objetivos do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de objetivos do usuário',
    type: [GoalViewDto],
  })
  async getGoals(@Request() req: any): Promise<GoalViewDto[]> {
    return this.goalsService.getGoals(req.user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Buscar objetivo ativo do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Objetivo ativo encontrado',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum objetivo ativo encontrado',
  })
  async getActiveGoal(@Request() req: any): Promise<GoalViewDto | null> {
    return this.goalsService.getActiveGoal(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar objetivo específico por ID' })
  @ApiResponse({
    status: 200,
    description: 'Objetivo encontrado',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Objetivo não encontrado',
  })
  async getGoalById(@Request() req: any, @Param('id') goalId: string): Promise<GoalViewDto> {
    return this.goalsService.getGoalById(req.user.id, goalId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar objetivo específico' })
  @ApiResponse({
    status: 200,
    description: 'Objetivo atualizado com sucesso',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Objetivo não encontrado',
  })
  async updateGoal(
    @Request() req: any,
    @Param('id') goalId: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ): Promise<GoalViewDto> {
    return this.goalsService.updateGoal(req.user.id, goalId, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar objetivo específico' })
  @ApiResponse({
    status: 204,
    description: 'Objetivo deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Objetivo não encontrado',
  })
  async deleteGoal(@Request() req: any, @Param('id') goalId: string): Promise<void> {
    return this.goalsService.deleteGoal(req.user.id, goalId);
  }
}
