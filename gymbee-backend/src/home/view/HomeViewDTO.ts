import { ApiProperty } from '@nestjs/swagger';

export class WorkoutRankingDto {
  @ApiProperty({ description: 'ID do treino' })
  id: string;

  @ApiProperty({ description: 'Nome do treino' })
  name: string;

  @ApiProperty({ description: 'Descrição do treino' })
  description: string;

  @ApiProperty({ description: 'Dia da semana (0-6, domingo-sábado)' })
  dayOfWeek: number;

  @ApiProperty({ description: 'Número de votos' })
  votes: number;

  @ApiProperty({ description: 'Posição no ranking' })
  position: number;
}

export class GymDto {
  @ApiProperty({ description: 'ID da academia' })
  id: string;

  @ApiProperty({ description: 'Nome da academia' })
  name: string;

  @ApiProperty({ description: 'Endereço da academia' })
  address: string;

  @ApiProperty({ description: 'Latitude' })
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  longitude: number;

  @ApiProperty({ description: 'Telefone da academia', required: false, nullable: true })
  phone?: string | null;

  @ApiProperty({ description: 'Website da academia', required: false, nullable: true })
  website?: string | null;

  @ApiProperty({ description: 'Distância em km do usuário' })
  distance: number;

  @ApiProperty({ description: 'Se é a academia atual do usuário' })
  isCurrentGym: boolean;
}

export class ArticleDto {
  @ApiProperty({ description: 'ID do artigo' })
  id: string;

  @ApiProperty({ description: 'Título do artigo' })
  title: string;

  @ApiProperty({ description: 'Conteúdo do artigo' })
  content: string;

  @ApiProperty({ description: 'Autor do artigo' })
  author: string;

  @ApiProperty({ description: 'Categoria do artigo' })
  category: string;

  @ApiProperty({ description: 'Tags do artigo' })
  tags: string[];

  @ApiProperty({ description: 'Número de visualizações' })
  views: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class ChallengeDto {
  @ApiProperty({ description: 'ID do desafio' })
  id: string;

  @ApiProperty({ description: 'Título do desafio' })
  title: string;

  @ApiProperty({ description: 'Descrição do desafio' })
  description: string;

  @ApiProperty({ description: 'Duração em minutos' })
  duration: number;

  @ApiProperty({ description: 'Dificuldade do desafio' })
  difficulty: string;

  @ApiProperty({ description: 'Categoria do desafio' })
  category: string;

  @ApiProperty({ description: 'Se o desafio está ativo' })
  isActive: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class HomeDataDto {
  @ApiProperty({ description: 'Ranking de treinos por dia da semana', type: [WorkoutRankingDto] })
  workoutRanking: WorkoutRankingDto[];

  @ApiProperty({ description: 'Academias próximas', type: [GymDto] })
  nearbyGyms: GymDto[];

  @ApiProperty({ description: 'Artigos em tendência', type: [ArticleDto] })
  trendingArticles: ArticleDto[];

  @ApiProperty({ description: 'Desafios diários', type: [ChallengeDto] })
  dailyChallenges: ChallengeDto[];
}
