export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  goalType: 'LOSE_WEIGHT' | 'GAIN_MASS' | 'IMPROVE_CONDITIONING';
  isCompleted: boolean;
  isAccepted: boolean;
  progress: number; // Progresso em porcentagem (0-100)
  startDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface UserChallenge {
  id: string;
  challenge: Challenge;
  isCompleted: boolean;
  completedAt: string | null;
  createdWorkouts?: number; // Número de treinos criados automaticamente
}

export interface ChallengeStats {
  completedChallenges: number;
  totalPoints: number;
  totalChallenges: number;
  completionRate: number;
}

export interface CompleteChallengeResponse {
  id: string;
  challenge: {
    id: string;
    title: string;
    description: string;
    points: number;
  };
  isCompleted: boolean;
  completedAt: string;
}