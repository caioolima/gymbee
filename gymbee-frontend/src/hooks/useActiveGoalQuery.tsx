'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useActiveGoal() {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar objetivo ativo
  const goalQuery = useQuery({
    queryKey: ['active-goal'],
    queryFn: async () => {
      try {
        const result = await apiService.getActiveGoal(token!);
        // Se a resposta indicar que não há objetivo ativo
        if (result && typeof result === 'object' && 'hasActiveGoal' in result && !result.hasActiveGoal) {
          return null;
        }
        // Se a resposta for um objeto vazio, retornar null
        if (result && typeof result === 'object' && Object.keys(result).length === 0) {
          return null;
        }
        return result;
      } catch (error: any) {
        // Se for erro 404 ou similar, retornar null em vez de erro
        if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('Nenhum objetivo ativo')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para atualizar peso do objetivo
  const updateWeightMutation = useMutation({
    mutationFn: async (weightData: { weight: number; notes?: string }) => {
      // Primeiro, criar entrada no histórico de peso
      await apiService.createWeightEntry(weightData, token!);
      
      // Depois, atualizar o peso atual do objetivo
      if (goalQuery.data && goalQuery.data.id) {
        await apiService.updateGoalWeight(goalQuery.data.id, weightData.weight, token!);
      }
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['active-goal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Peso atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Failed to update weight:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar peso. Tente novamente.');
    },
  });

  // Função para atualizar peso
  const registerWeight = (weightData: { weight: number; notes?: string }) => {
    updateWeightMutation.mutate(weightData);
  };

  return {
    // Dados
    goalData: goalQuery.data,
    
    // Estados de loading
    isLoading: goalQuery.isLoading,
    isRegisteringWeight: updateWeightMutation.isPending,
    
    // Estados de erro
    error: goalQuery.error,
    
    // Funções
    registerWeight,
    
    // Funções de refetch
    refetch: goalQuery.refetch,
  };
}
