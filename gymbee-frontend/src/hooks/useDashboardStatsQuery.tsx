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
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  return {
    stats: statsQuery.data || {
      weeklyWorkouts: 0,
      weeklyGoal: 5,
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
