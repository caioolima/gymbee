import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Buscar estatísticas do dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas encontradas com sucesso',
  })
  async getDashboardStats(@Request() req: any) {
    return this.dashboardService.getDashboardStats(req.user.id);
  }
}
