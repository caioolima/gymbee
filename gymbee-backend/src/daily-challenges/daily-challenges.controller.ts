import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DailyChallengesService } from './daily-challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Daily Challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/daily-challenges')
export class DailyChallengesController {
  constructor(private readonly dailyChallengesService: DailyChallengesService) {}

  @Get('today')
  @ApiOperation({ summary: 'Buscar desafio diário de hoje' })
  @ApiResponse({
    status: 200,
    description: 'Desafio diário encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum objetivo ativo encontrado',
  })
  async getTodaysChallenge(@Request() req: any, @Res() res: any) {
    const challenge = await this.dailyChallengesService.getTodaysChallenge(req.user.id);
    
    // Forçar headers anti-cache
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"${Date.now()}"` // ETag único para cada resposta
    });
    
    return res.json(challenge);
  }

  @Post(':challengeId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceitar desafio diário' })
  @ApiResponse({
    status: 200,
    description: 'Desafio diário aceito com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafio diário não encontrado',
  })
  async acceptDailyChallenge(
    @Request() req: any,
    @Param('challengeId') challengeId: string,
  ) {
    return this.dailyChallengesService.acceptDailyChallenge(req.user.id, challengeId);
  }

  @Post(':challengeId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Completar desafio diário' })
  @ApiResponse({
    status: 200,
    description: 'Desafio diário completado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafio diário não encontrado',
  })
  async completeDailyChallenge(
    @Request() req: any,
    @Param('challengeId') challengeId: string,
  ) {
    return this.dailyChallengesService.completeDailyChallenge(req.user.id, challengeId);
  }
}
