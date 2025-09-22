import { Controller, Get, Post, Body, Request, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AchievementViewDto } from './dto/AchievementViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as conquistas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de conquistas', type: [AchievementViewDto] })
  async getUserAchievements(@Request() req: any): Promise<AchievementViewDto[]> {
    return this.achievementsService.getUserAchievements(req.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Conta o total de conquistas do usuário' })
  @ApiResponse({ status: 200, description: 'Número total de conquistas' })
  async getAchievementCount(@Request() req: any): Promise<{ count: number }> {
    const count = await this.achievementsService.getAchievementCount(req.user.id);
    return { count };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marca uma conquista como lida' })
  @ApiResponse({ status: 200, description: 'Conquista marcada como lida' })
  async markAsRead(@Request() req: any, @Param('id') achievementId: string): Promise<{ message: string }> {
    await this.achievementsService.markAsRead(req.user.id, achievementId);
    return { message: 'Conquista marcada como lida' };
  }

  @Post('check')
  @ApiOperation({ summary: 'Verifica e cria novas conquistas' })
  @ApiResponse({ status: 200, description: 'Verificação de conquistas concluída' })
  async checkAchievements(@Request() req: any): Promise<{ message: string }> {
    await this.achievementsService.checkAndCreateAchievements(req.user.id);
    return { message: 'Verificação de conquistas concluída' };
  }
}
