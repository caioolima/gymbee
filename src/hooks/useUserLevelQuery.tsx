'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { apiService } from '@/services/api';

interface UserLevelInfo {
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  currentLevelXp: number;
  progressPercentage: number;
}

export function useUserLevel() {
  const { token, isAuthenticated } = useAuth();

  const levelQuery = useQuery({
    queryKey: ['user-level'],
    queryFn: () => apiService.getUserLevel(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    levelInfo: levelQuery.data as UserLevelInfo | undefined,
    isLoading: levelQuery.isLoading,
    error: levelQuery.error,
    refetch: levelQuery.refetch,
  };
}
