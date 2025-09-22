'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';

export interface Activity {
  id: string;
  type: 'workout' | 'weight' | 'achievement' | 'challenge';
  title: string;
  description: string;
  date: string;
  metadata: {
    workoutType?: string;
    source?: string;
    weight?: number;
    notes?: string;
    achievementType?: string;
    isRead?: boolean;
    points?: number;
    isCompleted?: boolean;
  };
}

export function useActivities(limit?: number) {
  const { token } = useAuth();

  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activities', limit],
    queryFn: () => apiService.getRecentActivities(token, limit),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!token,
  });

  return {
    activities: activities || [],
    isLoading,
    error,
    refetch,
  };
}
