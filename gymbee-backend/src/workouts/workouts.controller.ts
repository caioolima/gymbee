import { Controller, Get, Post, Body, Request, UseGuards, Query, Param, Patch, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/CreateWorkoutDTO';
import { UpdateWorkoutDto } from './dto/UpdateWorkoutDTO';
import { WorkoutViewDto } from './dto/WorkoutViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Workouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Registra um novo treino' })
  @ApiResponse({ status: 201, description: 'Treino registrado com sucesso', type: WorkoutViewDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createWorkout(@Request() req: any, @Body() createWorkoutDto: CreateWorkoutDto): Promise<WorkoutViewDto> {
    return this.workoutsService.createWorkout(req.user.id, createWorkoutDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os treinos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de treinos', type: [WorkoutViewDto] })
  async getUserWorkouts(
    @Request() req: any,
    @Query('limit') limit?: string
  ): Promise<WorkoutViewDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.workoutsService.getUserWorkouts(req.user.id, limitNumber);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Lista os treinos da semana atual' })
  @ApiResponse({ status: 200, description: 'Lista de treinos da semana', type: [WorkoutViewDto] })
  async getWeeklyWorkouts(@Request() req: any): Promise<WorkoutViewDto[]> {
    return this.workoutsService.getWeeklyWorkouts(req.user.id);
  }

  @Get('weekly/count')
  @ApiOperation({ summary: 'Conta os treinos da semana atual' })
  @ApiResponse({ status: 200, description: 'Número de treinos da semana' })
  async getWeeklyWorkoutCount(@Request() req: any): Promise<{ count: number }> {
    const count = await this.workoutsService.getWeeklyWorkoutCount(req.user.id);
    return { count };
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marca um treino como realizado' })
  @ApiResponse({ status: 200, description: 'Treino marcado como realizado', type: WorkoutViewDto })
  @ApiResponse({ status: 404, description: 'Treino não encontrado' })
  async markWorkoutAsCompleted(
    @Request() req: any,
    @Param('id') workoutId: string
  ): Promise<WorkoutViewDto> {
    return this.workoutsService.markWorkoutAsCompleted(req.user.id, workoutId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um treino existente' })
  @ApiResponse({ status: 200, description: 'Treino atualizado com sucesso', type: WorkoutViewDto })
  @ApiResponse({ status: 404, description: 'Treino não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateWorkout(
    @Request() req: any,
    @Param('id') workoutId: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto
  ): Promise<WorkoutViewDto> {
    return this.workoutsService.updateWorkout(req.user.id, workoutId, updateWorkoutDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um treino' })
  @ApiResponse({ status: 200, description: 'Treino excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Treino não encontrado' })
  async deleteWorkout(
    @Request() req: any,
    @Param('id') workoutId: string
  ): Promise<{ message: string }> {
    return this.workoutsService.deleteWorkout(req.user.id, workoutId);
  }
}
