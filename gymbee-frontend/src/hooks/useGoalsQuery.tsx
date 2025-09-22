'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useGoals() {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar todos os objetivos
  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const goals = await apiService.getAllGoals(token!);
      return goals;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para criar objetivo
  const createGoalMutation = useMutation({
    mutationFn: (goalData: any) =>
      apiService.createGoal(goalData, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['active-goal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Objetivo criado com sucesso! 🎯');
    },
    onError: (error: any) => {
      console.error('Failed to create goal:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar objetivo. Tente novamente.');
    },
  });

  // Mutation para atualizar objetivo
  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, goalData }: { goalId: string; goalData: any }) =>
      apiService.updateGoal(goalId, goalData, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['active-goal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Objetivo atualizado com sucesso! ✏️');
    },
    onError: (error: any) => {
      console.error('Failed to update goal:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar objetivo. Tente novamente.');
    },
  });

  // Mutation para deletar objetivo
  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) =>
      apiService.deleteGoal(goalId, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['active-goal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Objetivo excluído com sucesso! 🗑️');
    },
    onError: (error: any) => {
      console.error('Failed to delete goal:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir objetivo. Tente novamente.');
    },
  });

  // Funções para chamar as mutations
  const createGoal = (goalData: any) => {
    createGoalMutation.mutate(goalData);
  };

  const updateGoal = (goalId: string, goalData: any) => {
    updateGoalMutation.mutate({ goalId, goalData });
  };

  const deleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  return {
    // Dados
    goals: goalsQuery.data || [],
    
    // Estados de loading
    isLoading: goalsQuery.isLoading,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
    
    // Estados de erro
    error: goalsQuery.error,
    
    // Funções
    createGoal,
    updateGoal,
    deleteGoal,
    
    // Funções de refetch
    refetch: goalsQuery.refetch,
  };
}
