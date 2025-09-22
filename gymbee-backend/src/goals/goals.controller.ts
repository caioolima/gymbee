import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/CreateGoalDTO';
import { TestGoalDto } from './dto/TestGoalDTO';
import { SimpleGoalDto } from './dto/SimpleGoalDTO';
import { StringGoalDto } from './dto/StringGoalDTO';
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
  async createGoal(@Request() req: any, @Body() body: any): Promise<GoalViewDto> {
    console.log('=== DEBUG CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(body, null, 2));
    console.log('Req Body:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Se ambos estão undefined, criar dados de teste
    if (!body && !req.body) {
      console.log('⚠️  AMBOS BODY E REQ.BODY ESTÃO UNDEFINED!');
      console.log('Criando dados de teste...');
      
      const testData = {
        goalType: 'GAIN_MASS',
        currentWeight: 70,
        targetWeight: 75,
        height: 170,
        activityLevel: 'MODERATE',
        experienceLevel: 'INTERMEDIATE',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log('Dados de teste:', testData);
      return this.goalsService.createGoal(req.user.id, testData);
    }
    
    // Usar req.body se body estiver undefined
    const data = body || req.body;
    
    console.log('Data Types:', {
      goalType: typeof data?.goalType,
      currentWeight: typeof data?.currentWeight,
      targetWeight: typeof data?.targetWeight,
      height: typeof data?.height,
      activityLevel: typeof data?.activityLevel,
      experienceLevel: typeof data?.experienceLevel,
      deadline: typeof data?.deadline,
    });
    console.log('Data Values:', {
      goalType: data?.goalType,
      currentWeight: data?.currentWeight,
      targetWeight: data?.targetWeight,
      height: data?.height,
      activityLevel: data?.activityLevel,
      experienceLevel: data?.experienceLevel,
      deadline: data?.deadline,
    });
    console.log('========================');
    
    return this.goalsService.createGoal(req.user.id, data);
  }

  @Post('test')
  @ApiOperation({ summary: 'Teste de criação de objetivo' })
  async testCreateGoal(@Request() req: any, @Body() testGoalDto: any): Promise<any> {
    console.log('=== TEST CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    console.log('Received DTO:', JSON.stringify(testGoalDto, null, 2));
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('DTO Types:', {
      goalType: typeof testGoalDto?.goalType,
      currentWeight: typeof testGoalDto?.currentWeight,
      targetWeight: typeof testGoalDto?.targetWeight,
      height: typeof testGoalDto?.height,
      activityLevel: typeof testGoalDto?.activityLevel,
      experienceLevel: typeof testGoalDto?.experienceLevel,
      deadline: typeof testGoalDto?.deadline,
    });
    console.log('DTO Values:', {
      goalType: testGoalDto?.goalType,
      currentWeight: testGoalDto?.currentWeight,
      targetWeight: testGoalDto?.targetWeight,
      height: testGoalDto?.height,
      activityLevel: testGoalDto?.activityLevel,
      experienceLevel: testGoalDto?.experienceLevel,
      deadline: testGoalDto?.deadline,
    });
    console.log('========================');
    
    return { success: true, data: testGoalDto };
  }

  @Post('simple')
  @ApiOperation({ summary: 'Teste simples de criação de objetivo' })
  async simpleCreateGoal(@Request() req: any, @Body() simpleGoalDto: SimpleGoalDto): Promise<any> {
    console.log('=== SIMPLE CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    console.log('Received DTO:', JSON.stringify(simpleGoalDto, null, 2));
    console.log('DTO Types:', {
      goalType: typeof simpleGoalDto.goalType,
      currentWeight: typeof simpleGoalDto.currentWeight,
      targetWeight: typeof simpleGoalDto.targetWeight,
      height: typeof simpleGoalDto.height,
      activityLevel: typeof simpleGoalDto.activityLevel,
      experienceLevel: typeof simpleGoalDto.experienceLevel,
      deadline: typeof simpleGoalDto.deadline,
    });
    console.log('========================');
    
    return { success: true, data: simpleGoalDto };
  }

  @Post('raw')
  @ApiOperation({ summary: 'Teste sem validação' })
  async rawCreateGoal(@Request() req: any, @Body() body: any): Promise<any> {
    console.log('=== RAW CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(body, null, 2));
    console.log('Body Types:', {
      goalType: typeof body.goalType,
      currentWeight: typeof body.currentWeight,
      targetWeight: typeof body.targetWeight,
      height: typeof body.height,
      activityLevel: typeof body.activityLevel,
      experienceLevel: typeof body.experienceLevel,
      deadline: typeof body.deadline,
    });
    console.log('========================');
    
    return { success: true, data: body };
  }

  @Post('string')
  @ApiOperation({ summary: 'Teste com strings em vez de enums' })
  async stringCreateGoal(@Request() req: any, @Body() stringGoalDto: StringGoalDto): Promise<any> {
    console.log('=== STRING CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    console.log('Received DTO:', JSON.stringify(stringGoalDto, null, 2));
    console.log('DTO Types:', {
      goalType: typeof stringGoalDto.goalType,
      currentWeight: typeof stringGoalDto.currentWeight,
      targetWeight: typeof stringGoalDto.targetWeight,
      height: typeof stringGoalDto.height,
      activityLevel: typeof stringGoalDto.activityLevel,
      experienceLevel: typeof stringGoalDto.experienceLevel,
      deadline: typeof stringGoalDto.deadline,
    });
    console.log('========================');
    
    return { success: true, data: stringGoalDto };
  }

  @Post('working')
  @ApiOperation({ summary: 'Endpoint funcional para criação de objetivo' })
  async workingCreateGoal(@Request() req: any, @Body() body: any): Promise<any> {
    console.log('=== WORKING CREATE GOAL ===');
    console.log('User ID:', req.user.id);
    console.log('Raw Body:', JSON.stringify(body, null, 2));
    
    try {
      // Converter dados manualmente
      const goalData = {
        goalType: body.goalType,
        currentWeight: Number(body.currentWeight),
        targetWeight: Number(body.targetWeight),
        height: Number(body.height),
        activityLevel: body.activityLevel,
        experienceLevel: body.experienceLevel,
        deadline: body.deadline,
      };
      
      console.log('Dados convertidos:', JSON.stringify(goalData, null, 2));
      console.log('Tipos convertidos:', {
        goalType: typeof goalData.goalType,
        currentWeight: typeof goalData.currentWeight,
        targetWeight: typeof goalData.targetWeight,
        height: typeof goalData.height,
        activityLevel: typeof goalData.activityLevel,
        experienceLevel: typeof goalData.experienceLevel,
        deadline: typeof goalData.deadline,
      });
      
      // Chamar o service diretamente
      const result = await this.goalsService.createGoal(req.user.id, goalData);
      console.log('Resultado:', result);
      
      return result;
    } catch (error) {
      console.error('Erro no endpoint working:', error);
      throw error;
    }
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
  async getActiveGoal(@Request() req: any): Promise<GoalViewDto | { hasActiveGoal: false }> {
    try {
      const goal = await this.goalsService.getActiveGoal(req.user.id);
      return goal;
    } catch (error) {
      // Se for NotFoundException, retornar objeto indicando que não há objetivo ativo
      if (error.status === 404) {
        return { hasActiveGoal: false };
      }
      throw error;
    }
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
    @Body() body: any,
  ): Promise<GoalViewDto> {
    // Validação manual dos dados
    const updateGoalDto: UpdateGoalDto = {};
    
    if (body.goalType !== undefined) {
      updateGoalDto.goalType = body.goalType;
    }
    
    if (body.currentWeight !== undefined) {
      const weight = Number(body.currentWeight);
      if (isNaN(weight) || weight < 30 || weight > 300) {
        throw new BadRequestException('Peso deve estar entre 30 e 300 kg');
      }
      updateGoalDto.currentWeight = weight;
    }
    
    if (body.targetWeight !== undefined) {
      const weight = Number(body.targetWeight);
      if (isNaN(weight) || weight < 30 || weight > 300) {
        throw new BadRequestException('Peso alvo deve estar entre 30 e 300 kg');
      }
      updateGoalDto.targetWeight = weight;
    }
    
    if (body.deadline !== undefined) {
      updateGoalDto.deadline = body.deadline;
    }
    
    return this.goalsService.updateGoal(req.user.id, goalId, updateGoalDto);
  }

  @Patch(':id/weight')
  @ApiOperation({ summary: 'Atualizar peso atual do objetivo' })
  @ApiResponse({
    status: 200,
    description: 'Peso atualizado com sucesso',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Objetivo não encontrado',
  })
  async updateGoalWeight(
    @Request() req: any,
    @Param('id') goalId: string,
    @Body() body: { weight: number },
  ): Promise<GoalViewDto> {
    const weight = Number(body.weight);
    if (isNaN(weight) || weight < 30 || weight > 300) {
      throw new BadRequestException('Peso deve estar entre 30 e 300 kg');
    }
    
    return this.goalsService.updateGoal(req.user.id, goalId, { currentWeight: weight });
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Ativar/desativar objetivo' })
  @ApiResponse({
    status: 200,
    description: 'Status do objetivo atualizado com sucesso',
    type: GoalViewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Objetivo não encontrado',
  })
  async toggleGoalActive(
    @Request() req: any,
    @Param('id') goalId: string,
  ): Promise<GoalViewDto> {
    return this.goalsService.toggleGoalActive(req.user.id, goalId);
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
