import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export interface UserCard {
  id: string;
  fullName: string;
  username: string;
  age: number;
  gender: string;
  goalType?: string;
  experienceLevel?: string;
  workoutFrequency?: number;
  lastWorkoutDate?: string;
  compatibilityScore?: number;
}

export interface UserMatch {
  id: string;
  partner: {
    id: string;
    fullName: string;
    username: string;
    gender: string;
  };
  createdAt: string;
}

export interface SwipeData {
  swipedUserId: string;
  action: 'LIKE' | 'SKIP';
}

export interface MatchingFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  goalType?: string;
  experienceLevel?: string;
}

export function useUserMatching(filters?: MatchingFilters) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-matching', filters],
    queryFn: () => apiService.getUsersForMatching(token, filters),
    enabled: !!token,
    staleTime: 30000, // 30 segundos
  });

  const swipeMutation = useMutation({
    mutationFn: (swipeData: SwipeData) => 
      apiService.swipeUser(swipeData, token),
    onSuccess: (data, swipeData) => {
      // Remove o usuário da lista local em vez de recarregar tudo
      queryClient.setQueryData(['user-matching', filters], (oldData: UserCard[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(user => user.id !== swipeData.swipedUserId);
      });
      
      // Apenas invalida matches para atualizar a lista de matches
      queryClient.invalidateQueries({ queryKey: ['user-matches'] });
      
      // Retorna dados do match se houver
      return { isMatch: data.isMatch, matchData: data.isMatch ? data : null };
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao avaliar usuário');
      throw error;
    },
  });

  const swipeUser = async (swipeData: SwipeData) => {
    try {
      const result = await swipeMutation.mutateAsync(swipeData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    users,
    isLoading,
    error,
    swipeUser,
    isSwiping: swipeMutation.isPending,
    refetch,
  };
}

export function useUserMatches() {
  const { token } = useAuth();

  const {
    data: matches,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-matches'],
    queryFn: () => apiService.getUserMatches(token),
    enabled: !!token,
    refetchOnWindowFocus: true, // Recarrega quando o usuário volta à aba
  });

  return {
    matches,
    isLoading,
    error,
    refetch,
  };
}

// Hook para detectar novos matches
export function useNewMatches() {
  const { token } = useAuth();
  const [lastMatchCount, setLastMatchCount] = useState(0);
  const [hasNewMatches, setHasNewMatches] = useState(false);

  const {
    data: matches,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-matches'],
    queryFn: () => apiService.getUserMatches(token),
    enabled: !!token,
    refetchOnWindowFocus: true,
  });

  // Detectar novos matches
  useEffect(() => {
    if (matches && !isLoading) {
      const currentMatchCount = matches.length;
      
      // Se é a primeira vez carregando, apenas salva o count
      if (lastMatchCount === 0) {
        setLastMatchCount(currentMatchCount);
        return;
      }

      // Se há mais matches que antes, há novos matches
      if (currentMatchCount > lastMatchCount) {
        setHasNewMatches(true);
        setLastMatchCount(currentMatchCount);
      }
    }
  }, [matches, isLoading, lastMatchCount]);

  const clearNewMatches = () => {
    setHasNewMatches(false);
  };

  return {
    matches,
    isLoading,
    error,
    refetch,
    hasNewMatches,
    clearNewMatches,
  };
}
