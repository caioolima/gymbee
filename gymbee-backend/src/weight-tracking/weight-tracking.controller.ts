import { Controller, Get, Post, Body, Request, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WeightTrackingService } from './weight-tracking.service';
import { WeightEntryViewDto } from './dto/WeightEntryViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Weight Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/weight')
export class WeightTrackingController {
  constructor(private readonly weightTrackingService: WeightTrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Registra uma nova pesagem' })
  @ApiResponse({ status: 201, description: 'Pesagem registrada com sucesso', type: WeightEntryViewDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createWeightEntry(@Request() req: any, @Body() createWeightEntryDto: any): Promise<WeightEntryViewDto> {
    // Validação manual
    if (!createWeightEntryDto?.weight) {
      throw new BadRequestException('Weight is required');
    }
    
    const weight = Number(createWeightEntryDto.weight);
    if (isNaN(weight)) {
      throw new BadRequestException('Weight must be a number');
    }
    
    if (weight < 30) {
      throw new BadRequestException('Weight must not be less than 30');
    }
    
    if (weight > 300) {
      throw new BadRequestException('Weight must not be greater than 300');
    }
    
    // Criar objeto com dados validados
    const validatedData = {
      weight: weight,
      notes: createWeightEntryDto.notes || undefined
    };
    
    return this.weightTrackingService.createWeightEntry(req.user.id, validatedData);
  }

  @Get('history')
  @ApiOperation({ summary: 'Lista o histórico de pesagens do usuário' })
  @ApiResponse({ status: 200, description: 'Histórico de pesagens', type: [WeightEntryViewDto] })
  async getWeightHistory(
    @Request() req: any,
    @Query('limit') limit?: string
  ): Promise<WeightEntryViewDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 30;
    return this.weightTrackingService.getUserWeightHistory(req.user.id, limitNumber);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtém a última pesagem do usuário' })
  @ApiResponse({ status: 200, description: 'Última pesagem', type: WeightEntryViewDto })
  async getLatestWeight(@Request() req: any): Promise<WeightEntryViewDto | null> {
    return this.weightTrackingService.getLatestWeight(req.user.id);
  }


  @Get('progress/:goalId')
  @ApiOperation({ summary: 'Calcula o progresso baseado no peso atual' })
  @ApiResponse({ status: 200, description: 'Progresso calculado' })
  async calculateProgress(@Request() req: any, @Query('goalId') goalId: string): Promise<{ progress: number; currentWeight: number; targetWeight: number; weightDifference: number }> {
    return this.weightTrackingService.calculateProgress(req.user.id, goalId);
  }
}
