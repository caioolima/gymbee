'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

// Hook para buscar dados do usuário atual
export function useCurrentUser() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['currentUser', token],
    queryFn: () => apiService.getCurrentUser(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar objetivos do usuário
export function useUserGoals() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['userGoals', token],
    queryFn: () => apiService.getUserGoals(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar conquistas do usuário
export function useUserAchievements() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['userAchievements', token],
    queryFn: () => apiService.getUserAchievements(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar estatísticas do dashboard
export function useDashboardStats() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['dashboardStats', token],
    queryFn: () => apiService.getDashboardStats(token!),
    enabled: !!token,
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Hook para buscar treinos do usuário
export function useUserWorkouts(limit: number = 10) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['userWorkouts', token, limit],
    queryFn: () => apiService.getUserWorkouts(token!, limit),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para atualizar perfil do usuário
export function useUpdateProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: any) => {
      console.log('useUpdateProfile - Enviando:', updateData);
      return apiService.updateUserProfile(token!, updateData);
    },
    onSuccess: (data) => {
      console.log('useUpdateProfile - Sucesso:', data);
      toast.success('Perfil atualizado com sucesso!');
      // Invalidar queries relacionadas ao perfil
      queryClient.invalidateQueries({ queryKey: ['currentUser', token] });
      queryClient.invalidateQueries({ queryKey: ['profileData'] });
    },
    onError: (error) => {
      console.error('useUpdateProfile - Erro:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
    },
  });
}

// Hook para buscar todos os dados do perfil de uma vez
export function useProfileData() {
  const currentUser = useCurrentUser();
  const goals = useUserGoals();
  const achievements = useUserAchievements();
  const stats = useDashboardStats();
  const workouts = useUserWorkouts(5); // Últimos 5 treinos

  return {
    currentUser,
    goals,
    achievements,
    stats,
    workouts,
    isLoading: currentUser.isLoading || goals.isLoading || achievements.isLoading || stats.isLoading || workouts.isLoading,
    isError: currentUser.isError || goals.isError || achievements.isError || stats.isError || workouts.isError,
  };
}
