import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CheckInDto, CheckInResponseDto } from './dto/CheckInDTO';
import { HomeDataDto, WorkoutRankingDto, GymDto, ArticleDto, ChallengeDto } from './view/HomeViewDTO';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(private prisma: PrismaService) {}

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async getWorkoutRanking(dayOfWeek?: number): Promise<WorkoutRankingDto[]> {
    try {
      const whereClause = dayOfWeek !== undefined ? { dayOfWeek } : {};
      
      const rankings = await this.prisma.workoutRanking.findMany({
        where: whereClause,
        orderBy: { votes: 'desc' },
        take: 10,
      });

      return rankings.map((ranking, index) => ({
        id: ranking.id,
        name: ranking.name,
        description: ranking.description,
        dayOfWeek: ranking.dayOfWeek,
        votes: ranking.votes,
        position: index + 1,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar ranking de treinos: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar ranking de treinos');
    }
  }

  async getNearbyGyms(userLat: number, userLon: number, radius: number = 10): Promise<GymDto[]> {
    try {
      const gyms = await this.prisma.gym.findMany();
      
      const gymsWithDistance = gyms
        .map(gym => {
          const distance = this.calculateDistance(userLat, userLon, gym.latitude, gym.longitude);
          return {
            id: gym.id,
            name: gym.name,
            address: gym.address,
            latitude: gym.latitude,
            longitude: gym.longitude,
            phone: gym.phone,
            website: gym.website,
            distance,
            isCurrentGym: false, // TODO: Implementar lógica para academia atual
          };
        })
        .filter(gym => gym.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      return gymsWithDistance;
    } catch (error) {
      this.logger.error(`Erro ao buscar academias próximas: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar academias próximas');
    }
  }

  async checkInGym(userId: string, checkInDto: CheckInDto): Promise<CheckInResponseDto> {
    try {
      // Verificar se a academia existe
      const gym = await this.prisma.gym.findUnique({
        where: { id: checkInDto.gymId },
      });

      if (!gym) {
        throw new NotFoundException('Academia não encontrada');
      }

      // Verificar se o usuário já fez check-in hoje nesta academia
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingCheckIn = await this.prisma.gymCheckIn.findFirst({
        where: {
          userId,
          gymId: checkInDto.gymId,
          checkInAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingCheckIn) {
        throw new InternalServerErrorException('Você já fez check-in nesta academia hoje');
      }

      // Criar o check-in
      const checkIn = await this.prisma.gymCheckIn.create({
        data: {
          userId,
          gymId: checkInDto.gymId,
        },
      });

      this.logger.log(`Check-in realizado: usuário ${userId} na academia ${gym.name}`);

      return {
        id: checkIn.id,
        userId: checkIn.userId,
        gymId: checkIn.gymId,
        gymName: gym.name,
        checkInAt: checkIn.checkInAt,
        message: `Check-in realizado com sucesso na academia ${gym.name}`,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error(`Erro ao fazer check-in: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao fazer check-in');
    }
  }

  async getTrendingArticles(limit: number = 10): Promise<ArticleDto[]> {
    try {
      const articles = await this.prisma.article.findMany({
        orderBy: { views: 'desc' },
        take: limit,
      });

      return articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags,
        views: article.views,
        createdAt: article.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar artigos em tendência: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar artigos em tendência');
    }
  }

  async getDailyChallenges(): Promise<ChallengeDto[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return challenges.map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        duration: challenge.duration,
        difficulty: challenge.difficulty,
        category: challenge.category,
        isActive: challenge.isActive,
        createdAt: challenge.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar desafios diários: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar desafios diários');
    }
  }

  async getHomeData(userLat?: number, userLon?: number): Promise<HomeDataDto> {
    try {
      const [workoutRanking, nearbyGyms, trendingArticles, dailyChallenges] = await Promise.all([
        this.getWorkoutRanking(),
        userLat && userLon ? this.getNearbyGyms(userLat, userLon) : Promise.resolve([]),
        this.getTrendingArticles(),
        this.getDailyChallenges(),
      ]);

      return {
        workoutRanking,
        nearbyGyms,
        trendingArticles,
        dailyChallenges,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar dados da home: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao buscar dados da home');
    }
  }

  async voteWorkout(workoutId: string): Promise<void> {
    try {
      await this.prisma.workoutRanking.update({
        where: { id: workoutId },
        data: {
          votes: {
            increment: 1,
          },
        },
      });

      this.logger.log(`Voto registrado para treino: ${workoutId}`);
    } catch (error) {
      this.logger.error(`Erro ao votar no treino: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao votar no treino');
    }
  }

  async incrementArticleViews(articleId: string): Promise<void> {
    try {
      await this.prisma.article.update({
        where: { id: articleId },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      this.logger.log(`Visualização incrementada para artigo: ${articleId}`);
    } catch (error) {
      this.logger.error(`Erro ao incrementar visualizações: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao incrementar visualizações');
    }
  }
}
