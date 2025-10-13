'use client';

import { motion } from 'framer-motion';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Dumbbell,
  Activity,
  Zap,
  Target,
  MoreHorizontal,
  Eye,
  Trash2
} from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workouts';

interface WorkoutDayCardProps {
  day: Date;
  workouts: Workout[];
  plannedWorkouts: Workout[];
  isToday: boolean;
  isPast: boolean;
  onAddWorkout: () => void;
  onViewWorkouts: () => void;
  onDeleteWorkout: (workoutId: string) => void;
  getWorkoutTypeIcon: (type: WorkoutType) => any;
  getWorkoutTypeColor: (type: WorkoutType) => string;
}

export function WorkoutDayCard({
  day,
  workouts,
  plannedWorkouts,
  isToday,
  isPast,
  onAddWorkout,
  onViewWorkouts,
  onDeleteWorkout,
  getWorkoutTypeIcon,
  getWorkoutTypeColor
}: WorkoutDayCardProps) {
  const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayNumber = day.getDate();
  const month = day.toLocaleDateString('pt-BR', { month: 'short' });
  
  // Separar treinos realizados dos planejados
  const completedWorkouts = workouts.filter(w => w.isCompleted);
  const scheduledWorkouts = workouts.filter(w => !w.isCompleted);
  
  const totalWorkouts = completedWorkouts.length;
  const totalPlanned = scheduledWorkouts.length;
  const totalDuration = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/5 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 relative flex flex-col h-full min-h-[280px] ${
        isToday ? 'ring-2 ring-accent shadow-accent/20' : ''
      } ${isPast ? 'opacity-70' : ''}`}
    >
      {/* Day Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {dayName}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {dayNumber}
            </p>
            <p className="text-xs text-text-muted">
              {month}
            </p>
          </div>
          
          {isToday && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-medium text-accent">Hoje</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col min-h-[140px]">
        {/* Workouts List */}
        {completedWorkouts.length > 0 ? (
          <div className="space-y-3">
            {completedWorkouts.slice(0, 2).map((workout, index) => {
              const WorkoutIcon = getWorkoutTypeIcon(workout.type);
              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-input-bg/80 to-input-bg/60 rounded-xl p-3 border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <WorkoutIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {workout.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {workout.duration}min
                      </p>
                      <p className="text-xs text-accent font-medium">
                        {getWorkoutTypeLabel(workout.type)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {workouts.length > 2 && (
              <div className="text-center">
                <span className="text-xs text-accent font-medium">
                  +{workouts.length - 2} mais
                </span>
              </div>
            )}
          </div>
        ) : scheduledWorkouts.length > 0 ? (
          <div className="space-y-3">
            {scheduledWorkouts.slice(0, 2).map((workout, index) => {
              const WorkoutIcon = getWorkoutTypeIcon(workout.type);
              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-input-bg/80 to-input-bg/60 rounded-xl p-3 border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <WorkoutIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {workout.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {workout.duration}min
                      </p>
                      <p className="text-xs text-accent font-medium">
                        {getWorkoutTypeLabel(workout.type)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-text-muted flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center h-full min-h-[120px]">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-yellow-400/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-accent/60" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-muted">
                {isPast ? 'Nenhum treino' : 'Sem treinos'}
              </p>
              {!isPast && (
                <p className="text-xs text-text-muted/70">
                  Clique em + para adicionar
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats and Progress - Push to bottom */}
        <div className="mt-auto">
          {/* Stats */}
          {totalWorkouts > 0 && (
            <div className="mt-4 pt-3 border-t border-border/20">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{totalDuration}min</span>
                </div>
                {totalCalories > 0 && (
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" />
                    <span>{totalCalories} cal</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          {totalPlanned > 0 && (
            <div className="mt-3 pt-3 border-t border-border/20">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Progresso</span>
                <span>{totalWorkouts}/{totalPlanned}</span>
              </div>
              <div className="w-full bg-input-bg rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-accent to-yellow-300 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${totalPlanned > 0 ? (totalWorkouts / totalPlanned) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(totalWorkouts > 0 || totalPlanned > 0 || !isPast) && (
        <div className="p-4 border-t border-border/20 space-y-2">
        {/* Delete Workouts Button */}
        {(totalWorkouts > 0 || totalPlanned > 0) && (
          <button
            onClick={() => {
              // Mostrar lista de treinos para exclusão
              const allWorkouts = [...completedWorkouts, ...scheduledWorkouts];
              if (allWorkouts.length === 1) {
                onDeleteWorkout(allWorkouts[0].id);
              } else {
                // Se houver múltiplos treinos, mostrar modal de seleção
                onViewWorkouts();
              }
            }}
            className="w-full py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-500 hover:text-red-600 font-medium rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/40"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Treino
          </button>
        )}

        {/* View Workouts Button */}
        {(totalWorkouts > 0 || totalPlanned > 0) && (
          <button
            onClick={onViewWorkouts}
            className="w-full py-2.5 bg-gradient-to-r from-input-bg/60 to-input-bg/40 hover:from-input-bg/80 hover:to-input-bg/60 text-foreground font-medium rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-border/20 hover:border-border/40"
          >
            <Eye className="w-4 h-4" />
            Visualizar Treinos
          </button>
        )}
        
        {/* Add Button */}
        {!isPast && (
          <button
            onClick={onAddWorkout}
            className="w-full py-2.5 bg-gradient-to-r from-accent/20 to-yellow-300/20 hover:from-accent/30 hover:to-yellow-300/30 text-accent font-medium rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-accent/20 hover:border-accent/40"
          >
            <Plus className="w-4 h-4" />
            {totalWorkouts > 0 ? 'Adicionar' : 'Treinar'}
          </button>
        )}
        </div>
      )}
    </motion.div>
  );
}