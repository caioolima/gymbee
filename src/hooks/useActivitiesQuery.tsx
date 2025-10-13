import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

export interface Activity {
  id: string;
  type: 'workout' | 'achievement' | 'goal' | 'checkin';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export function useActivities(limit?: number) {
  const { token } = useAuth();

  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activities', limit],
    queryFn: () => apiService.getRecentActivities(token, limit),
    enabled: !!token,
  });

  return {
    activities,
    isLoading,
    error,
  };
}