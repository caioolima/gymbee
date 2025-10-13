import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

export function useUserRanking() {
  const { token } = useAuth();

  const {
    data: ranking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-ranking'],
    queryFn: () => apiService.getUserRanking(token),
    enabled: !!token,
  });

  return {
    ranking,
    isLoading,
    error,
  };
}

