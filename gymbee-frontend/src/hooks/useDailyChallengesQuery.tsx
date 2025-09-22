import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DailyChallenge {
  id: string;
  challenge: {
    id: string;
    title: string;
    description: string;
    points: number;
    goalType: string;
  };
  date: string;
  isAccepted: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
}

export function useDailyChallenges() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Buscar desafio diário de hoje
  const {
    data: todaysChallenge,
    isLoading: isLoadingTodaysChallenge,
    error: todaysChallengeError,
  } = useQuery({
    queryKey: ['daily-challenges', 'today'],
    queryFn: () => apiService.getTodaysDailyChallenge(token),
    staleTime: 0, // Sempre buscar dados frescos
    enabled: !!token,
  });

  // Aceitar desafio diário
  const acceptDailyChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => apiService.acceptDailyChallenge(challengeId, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      
      if (data.createdWorkouts > 0) {
        toast.success(`Desafio aceito! ${data.createdWorkouts} treino(s) criado(s) automaticamente.`);
      } else {
        toast.success('Desafio aceito com sucesso!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao aceitar desafio diário');
    },
  });

  // Completar desafio diário
  const completeDailyChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => apiService.completeDailyChallenge(challengeId, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      
      if (data.createdWorkouts > 0) {
        toast.success(`Desafio completado! ${data.createdWorkouts} treino(s) criado(s) automaticamente.`);
      } else {
        toast.success('Desafio completado com sucesso!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao completar desafio diário');
    },
  });

  return {
    todaysChallenge,
    isLoadingTodaysChallenge,
    todaysChallengeError,
    acceptDailyChallenge: acceptDailyChallengeMutation.mutate,
    completeDailyChallenge: completeDailyChallengeMutation.mutate,
    isAccepting: acceptDailyChallengeMutation.isPending,
    isCompleting: completeDailyChallengeMutation.isPending,
  };
}
