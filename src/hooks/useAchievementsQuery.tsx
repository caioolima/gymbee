'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import { Achievement } from '@/types/achievements';
import toast from 'react-hot-toast';

export function useAchievements() {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar conquistas
  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: () => apiService.getAchievements(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para buscar contagem de conquistas
  const countQuery = useQuery({
    queryKey: ['achievement-count'],
    queryFn: () => apiService.getAchievementCount(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para marcar conquista como lida
  const markAsReadMutation = useMutation({
    mutationFn: (achievementId: string) => 
      apiService.markAchievementAsRead(achievementId, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement-count'] });
    },
    onError: (error: any) => {
      console.error('Failed to mark achievement as read:', error);
      toast.error('Erro ao marcar conquista como lida.');
    },
  });

  // Mutation para verificar novas conquistas
  const checkAchievementsMutation = useMutation({
    mutationFn: () => apiService.checkAchievements(token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement-count'] });
    },
    onError: (error: any) => {
      console.error('Failed to check achievements:', error);
      toast.error('Erro ao verificar novas conquistas.');
    },
  });

  // Função para marcar como lida
  const markAchievementAsRead = (achievementId: string) => {
    markAsReadMutation.mutate(achievementId);
  };

  // Função para verificar conquistas
  const checkAndCreateAchievements = () => {
    checkAchievementsMutation.mutate();
  };

  // Contar conquistas não lidas
  const getUnreadCount = (): number => {
    if (!achievementsQuery.data) return 0;
    return achievementsQuery.data.filter((achievement: Achievement) => !achievement.isRead).length;
  };

  return {
    // Dados
    achievements: achievementsQuery.data || [],
    achievementCount: countQuery.data?.count || 0,
    
    // Estados de loading
    isLoading: achievementsQuery.isLoading || countQuery.isLoading,
    isMarkingAsRead: markAsReadMutation.isPending,
    isChecking: checkAchievementsMutation.isPending,
    
    // Estados de erro
    error: achievementsQuery.error || countQuery.error,
    
    // Funções
    markAchievementAsRead,
    checkAndCreateAchievements,
    getUnreadCount,
    
    // Funções de refetch
    refetchAchievements: achievementsQuery.refetch,
    refetchCount: countQuery.refetch,
  };
}
