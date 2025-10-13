'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, Calendar, Plus, Activity, Target, Zap } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { WorkoutType } from '@/types/workouts';
import { useState } from 'react';
import { RegisterWorkoutModal } from './RegisterWorkoutModal';
import { WorkoutHistoryModal } from './WorkoutHistoryModal';

interface LastWorkoutCardProps {
  user: any;
  onShowRegisterModal?: () => void;
  onShowHistoryModal?: () => void;
}

export function LastWorkoutCard({ user, onShowRegisterModal, onShowHistoryModal }: LastWorkoutCardProps) {
  const { lastWorkout, stats, isLoading, error } = useWorkouts();

  // Verificação adicional para evitar erros
  const safeStats = stats || {
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    monthlyWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageDuration: 0,
    averageCalories: 0,
    currentStreak: 0,
    bestStreak: 0,
    favoriteType: 'STRENGTH' as any,
  };

  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return Dumbbell;
      case WorkoutType.CARDIO:
        return Activity;
      case WorkoutType.FLEXIBILITY:
        return Zap;
      case WorkoutType.MIXED:
        return Target;
      default:
        return Dumbbell;
    }
  };

  const getWorkoutTypeLabel = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return 'Força';
      case WorkoutType.CARDIO:
        return 'Cardio';
      case WorkoutType.FLEXIBILITY:
        return 'Flexibilidade';
      case WorkoutType.MIXED:
        return 'Misto';
      default:
        return 'Treino';
    }
  };

  const getWorkoutTypeColor = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return 'from-accent via-yellow-400 to-amber-500';
      case WorkoutType.CARDIO:
        return 'from-slate-600 via-slate-500 to-slate-400';
      case WorkoutType.FLEXIBILITY:
        return 'from-orange-500 via-amber-500 to-accent';
      case WorkoutType.MIXED:
        return 'from-amber-600 via-accent to-yellow-300';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-accent animate-pulse" />
          </div>
          
          <h3 className="text-lg font-bold text-foreground mb-2">
            Carregando treinos...
          </h3>
          
          <p className="text-text-muted">
            Buscando seus dados de treino
          </p>
        </div>
      </motion.div>
    );
  }

  if (error || !lastWorkout) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-accent" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {error ? 'Erro ao carregar treinos' : 'Nenhum treino registrado'}
          </h3>
          
          <p className="text-text-muted mb-6 max-w-md mx-auto">
            {error 
              ? 'Ocorreu um problema ao carregar seus treinos. Tente novamente em alguns instantes.'
              : 'Registre seu primeiro treino e comece a acompanhar seu progresso!'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/workouts'}
              className="px-6 py-3 cursor-pointer bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-6 h-6 inline mr-2" />
              Registrar Treino
            </button>
            
            {!error && (
              <button
                onClick={() => window.location.href = '/workouts'}
                className="px-6 py-3 bg-transparent border border-accent text-accent hover:bg-accent/10 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
              >
                Ver Histórico
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const WorkoutIcon = getWorkoutTypeIcon(lastWorkout.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
    >
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-base text-text-muted font-semibold">Último Treino</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-accent via-yellow-400 to-amber-500 bg-clip-text text-transparent mt-1">
              {lastWorkout.name}
            </p>
            <p className="text-base font-semibold text-foreground mt-1">
              {getWorkoutTypeLabel(lastWorkout.type)} • {lastWorkout.duration}min
            </p>
            <p className="text-sm text-text-muted mt-1">
              {formatDate(lastWorkout.createdAt)} às {formatTime(lastWorkout.createdAt)}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <WorkoutIcon className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Workout Details */}
        <div className="mb-8">
          {lastWorkout.description && (
            <p className="text-base text-text-muted mb-4 leading-relaxed">
              {lastWorkout.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-accent mb-2">Calorias Queimadas</p>
              <p className="text-2xl font-bold text-foreground">
                {lastWorkout.calories ? `${lastWorkout.calories}` : 'N/A'}
              </p>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-accent mb-2">Treinos Esta Semana</p>
              <p className="text-2xl font-bold text-foreground">{safeStats.weeklyWorkouts}</p>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-accent mb-2">Total de Treinos</p>
              <p className="text-2xl font-bold text-foreground">{safeStats.totalWorkouts}</p>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-accent mb-2">Duração Média</p>
              <p className="text-2xl font-bold text-foreground">{safeStats.averageDuration}min</p>
            </div>
          </div>
        </div>


        {/* Bottom Actions */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => window.location.href = '/workouts'}
            whileHover={{ 
              scale: 1.02,
              y: -2,
              boxShadow: "0 10px 25px rgba(254, 205, 0, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {/* Button shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <Plus className="w-6 h-6" />
            Novo Treino
          </motion.button>
          
          <motion.button
            onClick={() => window.location.href = '/workouts'}
            whileHover={{ 
              scale: 1.02,
              y: -2,
              backgroundColor: "rgba(254, 205, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-transparent border border-accent text-accent hover:bg-accent/10 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          >
            Histórico
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}

// Renderizar modais fora do componente principal
export function LastWorkoutCardWithModals({ user }: LastWorkoutCardProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleShowHistoryModal = () => {
    setShowHistoryModal(true);
  };

  return (
    <>
      <LastWorkoutCard 
        user={user} 
        onShowRegisterModal={handleShowRegisterModal}
        onShowHistoryModal={handleShowHistoryModal}
      />
      
      {showRegisterModal && (
        <RegisterWorkoutModal onClose={() => setShowRegisterModal(false)} />
      )}
      
      {showHistoryModal && (
        <WorkoutHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}
      
    </>
  );
}
