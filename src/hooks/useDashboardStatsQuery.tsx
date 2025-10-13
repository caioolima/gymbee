'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

export function useDashboardStats() {
  const { token, isAuthenticated } = useAuth();

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiService.getDashboardStats(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    stats: statsQuery.data || {
      weeklyWorkouts: 0,
      weeklyGoal: 3, // Padrão de 3 treinos por semana
      totalWorkouts: 0,
      averageWorkoutDuration: 0,
      currentStreak: 0,
      bestStreak: 0,
      activeDaysLastMonth: 0,
      goalsAchieved: 0,
      goalsInProgress: 0,
    },
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
}
