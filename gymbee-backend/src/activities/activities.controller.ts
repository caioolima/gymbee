import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('recent')
  @ApiOperation({ summary: 'Buscar atividades recentes do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Atividades recentes encontradas com sucesso',
  })
  async getRecentActivities(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.activitiesService.getRecentActivities(req.user.id, limitNumber);
  }
}
