'use client';

import { motion } from 'framer-motion';
import { Dumbbell, X, Clock, Flame, Calendar, Activity, Zap, Target, Filter } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { Workout, WorkoutType } from '@/types/workouts';
import { useState } from 'react';

interface WorkoutHistoryModalProps {
  onClose: () => void;
}

export function WorkoutHistoryModal({ onClose }: WorkoutHistoryModalProps) {
  const { workouts, isLoading, error } = useWorkouts();
  const [filterType, setFilterType] = useState<WorkoutType | 'ALL'>('ALL');

  const workoutTypes = [
    { value: 'ALL' as const, label: 'Todos', icon: Dumbbell, color: 'from-gray-500 to-gray-600' },
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-accent via-yellow-400 to-amber-500' },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-yellow-500 to-orange-500' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-orange-500 to-accent' },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-amber-600 via-accent to-yellow-300' },
  ];

  const getWorkoutTypeIcon = (type: WorkoutType) => {
    const workoutType = workoutTypes.find(t => t.value === type);
    return workoutType?.icon || Dumbbell;
  };

  const getWorkoutTypeColor = (type: WorkoutType) => {
    const workoutType = workoutTypes.find(t => t.value === type);
    return workoutType?.color || 'from-gray-500 to-gray-600';
  };

  const getWorkoutTypeLabel = (type: WorkoutType) => {
    const workoutType = workoutTypes.find(t => t.value === type);
    return workoutType?.label || 'Treino';
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

  const filteredWorkouts = workouts.filter(workout => 
    filterType === 'ALL' || workout.type === filterType
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card-bg p-8 rounded-2xl shadow-xl border border-border/50 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Dumbbell className="w-10 h-10 text-accent" />
          </motion.div>
          <p className="mt-4 text-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card-bg p-8 rounded-2xl shadow-xl border border-border/50 flex flex-col items-center">
          <Dumbbell className="w-10 h-10 text-red-500" />
          <p className="mt-4 text-red-500">{error?.message || 'Erro desconhecido'}</p>
          <button 
            onClick={onClose} 
            className="mt-4 px-4 py-2 bg-accent text-background rounded-lg cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Histórico de Treinos
            </h2>
            <p className="text-text-muted text-sm mt-1">
              {filteredWorkouts.length} treino{filteredWorkouts.length !== 1 ? 's' : ''} encontrado{filteredWorkouts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-medium text-foreground">Filtrar por tipo:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {workoutTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = filterType === type.value;
              
              return (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? `bg-gradient-to-r ${type.color} text-white`
                      : 'bg-input-bg/50 text-text-muted hover:text-foreground hover:bg-input-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workouts List */}
        {filteredWorkouts.length === 0 ? (
          <div className="text-center text-text-muted py-10">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">Nenhum treino encontrado.</p>
            <p className="text-sm mt-2">
              {filterType === 'ALL' 
                ? 'Registre seu primeiro treino para começar!'
                : 'Nenhum treino deste tipo encontrado.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkouts.map((workout, index) => {
              const WorkoutIcon = getWorkoutTypeIcon(workout.type);
              
              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Workout Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <WorkoutIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Workout Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground truncate">
                            {workout.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} text-white`}>
                            {getWorkoutTypeLabel(workout.type)}
                          </span>
                        </div>
                        
                        {workout.description && (
                          <p className="text-text-muted text-sm mb-3 line-clamp-2">
                            {workout.description}
                          </p>
                        )}
                        
                        {/* Workout Stats */}
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(workout.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(workout.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{workout.duration} min</span>
                          </div>
                          {workout.calories && (
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              <span>{workout.calories} cal</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Exercises */}
                        {workout.exercises && workout.exercises.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-text-muted mb-2">
                              {workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {workout.exercises.slice(0, 3).map((exercise: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-input-bg/50 rounded text-xs text-foreground"
                                >
                                  {exercise.name} ({exercise.sets}x{exercise.reps})
                                </span>
                              ))}
                              {workout.exercises.length > 3 && (
                                <span className="px-2 py-1 bg-input-bg/50 rounded text-xs text-text-muted">
                                  +{workout.exercises.length - 3} mais
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Notes */}
                        {workout.notes && (
                          <div className="mt-3">
                            <p className="text-xs text-text-muted mb-1">Observações:</p>
                            <p className="text-sm text-foreground line-clamp-2">
                              {workout.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
