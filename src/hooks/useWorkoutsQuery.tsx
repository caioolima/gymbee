'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import { useAuthError } from './useAuthError';
import { Workout, CreateWorkoutRequest, WorkoutType } from '@/types/workouts';
import toast from 'react-hot-toast';

export function useWorkouts() {
  const { token, isAuthenticated } = useAuth();
  const { handleAuthError } = useAuthError();
  const queryClient = useQueryClient();

  // Query para buscar treinos do usuário
  const workoutsQuery = useQuery({
    queryKey: ['workouts'],
    queryFn: () => apiService.getUserWorkouts(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Query para buscar treinos da semana
  const weeklyWorkoutsQuery = useQuery({
    queryKey: ['weekly-workouts'],
    queryFn: () => apiService.getWeeklyWorkouts(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para buscar contagem semanal
  const weeklyCountQuery = useQuery({
    queryKey: ['weekly-workout-count'],
    queryFn: () => apiService.getWeeklyWorkoutCount(token!),
    enabled: !!token && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para criar treino
  const createWorkoutMutation = useMutation({
    mutationFn: (workoutData: CreateWorkoutRequest) => 
      apiService.createWorkout(workoutData, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workout-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Treino registrado com sucesso! 🏋️‍♂️');
    },
    onError: (error: any) => {
      console.error('Failed to create workout:', error);
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.message || 'Erro ao registrar treino.');
    },
  });

  // Função para criar treino
  const createWorkout = (workoutData: CreateWorkoutRequest) => {
    createWorkoutMutation.mutate(workoutData);
  };

  // Mutation para marcar treino como completo
  const markWorkoutCompleteMutation = useMutation({
    mutationFn: (workoutId: string) => 
      apiService.markWorkoutAsCompleted(workoutId, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workout-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Treino marcado como realizado! ✅');
    },
    onError: (error: any) => {
      console.error('Failed to mark workout as completed:', error);
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.message || 'Erro ao marcar treino como realizado.');
    },
  });

  // Função para marcar treino como completo
  const markWorkoutAsCompleted = (workoutId: string) => {
    markWorkoutCompleteMutation.mutate(workoutId);
  };

  // Mutation para atualizar treino
  const updateWorkoutMutation = useMutation({
    mutationFn: ({ workoutId, workoutData }: { workoutId: string; workoutData: Partial<CreateWorkoutRequest> }) => 
      apiService.updateWorkout(workoutId, workoutData, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workout-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Treino atualizado com sucesso! ✏️');
    },
    onError: (error: any) => {
      console.error('Failed to update workout:', error);
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.message || 'Erro ao atualizar treino.');
    },
  });

  // Mutation para excluir treino
  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId: string) => 
      apiService.deleteWorkout(workoutId, token!),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workouts'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-workout-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Treino excluído com sucesso! 🗑️');
    },
    onError: (error: any) => {
      console.error('Failed to delete workout:', error);
      if (handleAuthError(error)) return;
      toast.error(error.response?.data?.message || 'Erro ao excluir treino.');
    },
  });

  // Função para atualizar treino
  const updateWorkout = (workoutId: string, workoutData: Partial<CreateWorkoutRequest>) => {
    updateWorkoutMutation.mutate({ workoutId, workoutData });
  };

  // Função para excluir treino
  const deleteWorkout = (workoutId: string) => {
    deleteWorkoutMutation.mutate(workoutId);
  };

  // Função para obter último treino
  const getLastWorkout = (): Workout | null => {
    if (!workoutsQuery.data || !Array.isArray(workoutsQuery.data) || workoutsQuery.data.length === 0) return null;
    return workoutsQuery.data[0]; // Assumindo que está ordenado por data decrescente
  };

  // Função para obter treinos da semana
  const getWeeklyWorkouts = (): Workout[] => {
    return weeklyWorkoutsQuery.data || [];
  };

  // Função para obter contagem semanal
  const getWeeklyCount = (): number => {
    return weeklyCountQuery.data?.count || 0;
  };

  // Função para obter estatísticas básicas
  const getWorkoutStats = () => {
    const workouts = Array.isArray(workoutsQuery.data) ? workoutsQuery.data : [];
    const weeklyWorkouts = getWeeklyWorkouts();
    
    const totalWorkouts = workouts.length;
    const weeklyCount = getWeeklyCount();
    const totalDuration = workouts.length > 0 ? workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) : 0;
    const totalCalories = workouts.length > 0 ? workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0) : 0;
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    const averageCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;

    // Calcular streak (simplificado)
    const currentStreak = calculateStreak(workouts);
    const bestStreak = calculateBestStreak(workouts);

    // Tipo favorito
    const typeCounts = workouts.length > 0 ? workouts.reduce((acc, workout) => {
      if (workout.type) {
        acc[workout.type] = (acc[workout.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<WorkoutType, number>) : {};
    
    const favoriteType = Object.keys(typeCounts).length > 0 
      ? Object.entries(typeCounts).reduce((a, b) => 
          typeCounts[a[0] as WorkoutType] > typeCounts[b[0] as WorkoutType] ? a : b
        )?.[0] as WorkoutType || WorkoutType.STRENGTH
      : WorkoutType.STRENGTH;

    return {
      totalWorkouts,
      weeklyWorkouts: weeklyCount,
      monthlyWorkouts: workouts.length > 0 ? workouts.filter(w => {
        if (!w.createdAt) return false;
        const workoutDate = new Date(w.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return workoutDate >= monthAgo;
      }).length : 0,
      totalDuration,
      totalCalories,
      averageDuration,
      averageCalories,
      currentStreak,
      bestStreak,
      favoriteType,
    };
  };

  // Função auxiliar para calcular streak
  const calculateStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].createdAt);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Função auxiliar para calcular melhor streak
  const calculateBestStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    let bestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDate = new Date(sortedWorkouts[i - 1].createdAt);
      const currDate = new Date(sortedWorkouts[i].createdAt);
      
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    return Math.max(bestStreak, currentStreak);
  };

  return {
    // Dados
    workouts: workoutsQuery.data || [],
    weeklyWorkouts: getWeeklyWorkouts(),
    lastWorkout: getLastWorkout(),
    stats: getWorkoutStats(),
    
    // Estados de loading
    isLoading: workoutsQuery.isLoading || weeklyWorkoutsQuery.isLoading || weeklyCountQuery.isLoading,
    isCreating: createWorkoutMutation.isPending,
    
    // Estados de erro
    error: workoutsQuery.error || weeklyWorkoutsQuery.error || weeklyCountQuery.error,
    
    // Funções
    createWorkout,
    markWorkoutAsCompleted,
    updateWorkout,
    deleteWorkout,
    getLastWorkout,
    getWeeklyWorkouts,
    getWeeklyCount,
    getWorkoutStats,
    
    // Estados de loading
    isMarkingComplete: markWorkoutCompleteMutation.isPending,
    isUpdating: updateWorkoutMutation.isPending,
    isDeleting: deleteWorkoutMutation.isPending,
    
    // Funções de refetch
    refetchWorkouts: workoutsQuery.refetch,
    refetchWeekly: weeklyWorkoutsQuery.refetch,
    refetchCount: weeklyCountQuery.refetch,
  };
}
