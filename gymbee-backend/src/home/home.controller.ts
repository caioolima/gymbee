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
import { HomeService } from './home.service';
import { CheckInDto, CheckInResponseDto } from './dto/CheckInDTO';
import { HomeDataDto, WorkoutRankingDto, GymDto, ArticleDto, ChallengeDto } from './view/HomeViewDTO';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Página Home')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os dados da página home' })
  @ApiResponse({
    status: 200,
    description: 'Dados da home carregados com sucesso',
    type: HomeDataDto,
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    description: 'Latitude do usuário para buscar academias próximas',
    example: -23.5505,
  })
  @ApiQuery({
    name: 'lon',
    required: false,
    description: 'Longitude do usuário para buscar academias próximas',
    example: -46.6333,
  })
  async getHomeData(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ): Promise<HomeDataDto> {
    const userLat = lat ? parseFloat(lat) : undefined;
    const userLon = lon ? parseFloat(lon) : undefined;
    
    return this.homeService.getHomeData(userLat, userLon);
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Buscar ranking de treinos' })
  @ApiResponse({
    status: 200,
    description: 'Ranking de treinos carregado com sucesso',
    type: [WorkoutRankingDto],
  })
  @ApiQuery({
    name: 'dayOfWeek',
    required: false,
    description: 'Dia da semana (0-6, domingo-sábado)',
    example: 1,
  })
  async getWorkoutRanking(@Query('dayOfWeek') dayOfWeek?: string): Promise<WorkoutRankingDto[]> {
    const day = dayOfWeek ? parseInt(dayOfWeek) : undefined;
    return this.homeService.getWorkoutRanking(day);
  }

  @Get('gyms')
  @ApiOperation({ summary: 'Buscar academias próximas' })
  @ApiResponse({
    status: 200,
    description: 'Academias próximas carregadas com sucesso',
    type: [GymDto],
  })
  @ApiQuery({
    name: 'lat',
    required: true,
    description: 'Latitude do usuário',
    example: -23.5505,
  })
  @ApiQuery({
    name: 'lon',
    required: true,
    description: 'Longitude do usuário',
    example: -46.6333,
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    description: 'Raio de busca em km',
    example: 10,
  })
  async getNearbyGyms(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius?: string,
  ): Promise<GymDto[]> {
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const searchRadius = radius ? parseFloat(radius) : 10;
    
    return this.homeService.getNearbyGyms(userLat, userLon, searchRadius);
  }

  @Post('gyms/checkin')
  @ApiOperation({ summary: 'Fazer check-in em uma academia' })
  @ApiResponse({
    status: 201,
    description: 'Check-in realizado com sucesso',
    type: CheckInResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Academia não encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já fez check-in hoje nesta academia',
  })
  async checkInGym(@Request() req: any, @Body() checkInDto: CheckInDto): Promise<CheckInResponseDto> {
    return this.homeService.checkInGym(req.user.id, checkInDto);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Buscar artigos em tendência' })
  @ApiResponse({
    status: 200,
    description: 'Artigos em tendência carregados com sucesso',
    type: [ArticleDto],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de artigos',
    example: 10,
  })
  async getTrendingArticles(@Query('limit') limit?: string): Promise<ArticleDto[]> {
    const articleLimit = limit ? parseInt(limit) : 10;
    return this.homeService.getTrendingArticles(articleLimit);
  }

  @Get('challenges')
  @ApiOperation({ summary: 'Buscar desafios diários' })
  @ApiResponse({
    status: 200,
    description: 'Desafios diários carregados com sucesso',
    type: [ChallengeDto],
  })
  async getDailyChallenges(): Promise<ChallengeDto[]> {
    return this.homeService.getDailyChallenges();
  }

  @Post('challenges/:challengeId/participate')
  @ApiOperation({ summary: 'Participar de um desafio' })
  @ApiResponse({
    status: 201,
    description: 'Participação no desafio registrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Desafio não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário já está participando de um desafio',
  })
  async participateInChallenge(
    @Param('challengeId') challengeId: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.homeService.participateInChallenge(req.user.id, challengeId);
  }

  @Get('challenges/history')
  @ApiOperation({ summary: 'Buscar histórico de participações em desafios' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de participações carregado com sucesso',
  })
  async getChallengeHistory(@Request() req: any): Promise<any[]> {
    return this.homeService.getChallengeHistory(req.user.id);
  }

  @Post('ranking/:workoutId/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Votar em um treino' })
  @ApiResponse({
    status: 204,
    description: 'Voto registrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Treino não encontrado',
  })
  async voteWorkout(@Param('workoutId') workoutId: string): Promise<void> {
    return this.homeService.voteWorkout(workoutId);
  }

  @Post('articles/:articleId/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Incrementar visualizações de um artigo' })
  @ApiResponse({
    status: 204,
    description: 'Visualização registrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Artigo não encontrado',
  })
  async incrementArticleViews(@Param('articleId') articleId: string): Promise<void> {
    return this.homeService.incrementArticleViews(articleId);
  }
}
