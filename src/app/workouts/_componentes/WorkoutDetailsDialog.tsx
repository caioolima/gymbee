'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Dumbbell, Activity, Zap, Target, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workouts';

interface WorkoutDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  day: Date;
  workouts: Workout[];
  plannedWorkouts: Workout[];
  getWorkoutTypeIcon: (type: WorkoutType) => any;
  getWorkoutTypeColor: (type: WorkoutType) => string;
  onMarkAsCompleted?: (workoutId: string) => void;
  isMarkingComplete?: boolean;
}

export function WorkoutDetailsDialog({
  isOpen,
  onClose,
  day,
  workouts,
  plannedWorkouts,
  getWorkoutTypeIcon,
  getWorkoutTypeColor,
  onMarkAsCompleted,
  isMarkingComplete = false
}: WorkoutDetailsDialogProps) {
  const dayName = day.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayNumber = day.getDate();
  const month = day.toLocaleDateString('pt-BR', { month: 'long' });
  const year = day.getFullYear();

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

  // Separar treinos realizados dos planejados
  const completedWorkouts = workouts.filter(w => w.isCompleted);
  const scheduledWorkouts = workouts.filter(w => !w.isCompleted);
  
  // Total de treinos = realizados + agendados
  const totalWorkouts = workouts.length; // Total de treinos do dia
  const totalCompleted = completedWorkouts.length; // Treinos realizados
  const totalScheduled = scheduledWorkouts.length; // Treinos agendados
  const totalDuration = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="w-6 h-6 text-accent" />
                {dayName}, {dayNumber} de {month} de {year}
              </h2>
              <p className="text-text-muted text-sm mt-1">
                Detalhes dos treinos do dia
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 rounded-xl p-4 border border-border/20">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text-muted">Total de Treinos</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
            </div>
            
            <div className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 rounded-xl p-4 border border-border/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text-muted">Duração</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalDuration}min</p>
            </div>
            
            {totalCalories > 0 && (
              <div className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 rounded-xl p-4 border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-text-muted">Calorias</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalCalories}</p>
              </div>
            )}
            
            {totalWorkouts > 0 && (
              <div className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 rounded-xl p-4 border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-text-muted">Progresso</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalCompleted}/{totalWorkouts}</p>
              </div>
            )}
          </div>

          {/* Workouts List */}
          <div className="space-y-4">
            {/* Completed Workouts */}
            {completedWorkouts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Treinos Realizados
                </h3>
                <div className="space-y-3">
                  {completedWorkouts.map((workout, index) => {
                    const WorkoutIcon = getWorkoutTypeIcon(workout.type);
                    return (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-input-bg/80 to-input-bg/60 rounded-xl p-4 border border-border/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <WorkoutIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground mb-1">
                              {workout.name}
                            </h4>
                            <p className="text-sm text-accent font-medium mb-2">
                              {getWorkoutTypeLabel(workout.type)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-text-muted">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{workout.duration}min</span>
                              </div>
                              {workout.calories && (
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" />
                                  <span>{workout.calories} cal</span>
                                </div>
                              )}
                            </div>
                            {workout.description && (
                              <p className="text-sm text-text-muted mt-2">
                                {workout.description}
                              </p>
                            )}
                            {workout.exercises && workout.exercises.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-xs font-semibold text-foreground mb-2">Exercícios:</h5>
                                <div className="space-y-1">
                                  {workout.exercises.map((exercise: any, index: number) => (
                                    <div key={index} className="text-xs text-text-muted flex items-center gap-2">
                                      <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                      <span className="font-medium">{exercise.name}</span>
                                      <span className="text-text-muted/70">
                                        {exercise.sets}x{exercise.reps}
                                        {exercise.weight && exercise.weight > 0 && ` - ${exercise.weight}kg`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scheduled Workouts */}
            {scheduledWorkouts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Circle className="w-5 h-5 text-text-muted" />
                  Treinos Agendados
                </h3>
                <div className="space-y-3">
                  {scheduledWorkouts.map((workout, index) => {
                    const WorkoutIcon = getWorkoutTypeIcon(workout.type);
                    return (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-input-bg/80 to-input-bg/60 rounded-xl p-4 border border-border/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <WorkoutIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground mb-1">
                              {workout.name}
                            </h4>
                            <p className="text-sm text-accent font-medium mb-2">
                              {getWorkoutTypeLabel(workout.type)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-text-muted">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{workout.duration}min</span>
                              </div>
                              {workout.calories && (
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" />
                                  <span>{workout.calories} cal</span>
                                </div>
                              )}
                            </div>
                            {workout.description && (
                              <p className="text-sm text-text-muted mt-2">
                                {workout.description}
                              </p>
                            )}
                            {workout.exercises && workout.exercises.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-xs font-semibold text-foreground mb-2">Exercícios:</h5>
                                <div className="space-y-1">
                                  {workout.exercises.map((exercise: any, index: number) => (
                                    <div key={index} className="text-xs text-text-muted flex items-center gap-2">
                                      <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                      <span className="font-medium">{exercise.name}</span>
                                      <span className="text-text-muted/70">
                                        {exercise.sets}x{exercise.reps}
                                        {exercise.weight && exercise.weight > 0 && ` - ${exercise.weight}kg`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Circle className="w-6 h-6 text-text-muted flex-shrink-0" />
                            {onMarkAsCompleted && (
                              <button
                                onClick={() => onMarkAsCompleted(workout.id)}
                                disabled={isMarkingComplete}
                                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-500/50 disabled:to-green-600/50 text-white text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {isMarkingComplete ? 'Marcando...' : 'Marcar como Feito'}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalWorkouts === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-input-bg to-input-bg/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum treino
                </h3>
                <p className="text-text-muted">
                  Não há treinos agendados para este dia
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-border/20">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
