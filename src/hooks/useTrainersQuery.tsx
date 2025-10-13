import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Trainer {
  id: string;
  fullName: string;
  username: string;
  age: number;
  gender: string;
  cref: string;
  location?: string;
  rating?: number;
  averageRating?: number;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface SwipeData {
  trainerId: string;
  action: 'LIKE' | 'SKIP';
}

export function useTrainers() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: trainers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => apiService.getTrainers(token),
    enabled: !!token,
  });

  const swipeMutation = useMutation({
    mutationFn: ({ trainerId, action }: SwipeData) => 
      apiService.swipeTrainer(trainerId, action, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      if (data.action === 'LIKE') {
        toast.success('Trainer curtido!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao avaliar trainer');
    },
  });

  const swipeTrainer = (trainerId: string, action: 'LIKE' | 'SKIP') => {
    return swipeMutation.mutateAsync({ trainerId, action });
  };

  return {
    trainers,
    isLoading,
    error,
    swipeTrainer,
    isSwiping: swipeMutation.isPending,
  };
}

export function useTrainerContracts() {
  const { token } = useAuth();

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trainer-contracts'],
    queryFn: () => apiService.getMyTrainerContracts(token),
    enabled: !!token,
  });

  return {
    contracts,
    isLoading,
    error,
  };
}
