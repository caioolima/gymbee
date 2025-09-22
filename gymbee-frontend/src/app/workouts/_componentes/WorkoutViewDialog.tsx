'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Dumbbell, 
  Activity, 
  Zap, 
  Target, 
  Calendar, 
  Flame, 
  CheckCircle, 
  Circle,
  RotateCcw,
  Edit,
  Trash2
} from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workouts';

interface WorkoutViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout | null;
  onEdit?: (workout: Workout) => void;
  onDelete?: (workout: Workout) => void;
  onMarkAsCompleted?: (workoutId: string) => void;
  isMarkingComplete?: boolean;
}

export function WorkoutViewDialog({
  isOpen,
  onClose,
  workout,
  onEdit,
  onDelete,
  onMarkAsCompleted,
  isMarkingComplete = false
}: WorkoutViewDialogProps) {
  if (!isOpen || !workout) return null;

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

  const getWorkoutTypeColor = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return 'from-red-500 to-red-600';
      case WorkoutType.CARDIO:
        return 'from-blue-500 to-blue-600';
      case WorkoutType.FLEXIBILITY:
        return 'from-green-500 to-green-600';
      case WorkoutType.MIXED:
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const TypeIcon = getWorkoutTypeIcon(workout.type);
  const typeColor = getWorkoutTypeColor(workout.type);
  const typeLabel = getWorkoutTypeLabel(workout.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-border">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-accent/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>

                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${typeColor} text-white`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {workout.name}
                    </h2>
                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="text-sm font-medium text-accent">{typeLabel}</span>
                      {workout.source === 'template' && (
                        <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded-full">
                          Template
                        </span>
                      )}
                      {workout.source === 'user-created' && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full">
                          Personalizado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    {workout.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-text-muted" />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {workout.isCompleted ? 'Treino Concluído' : 'Treino Agendado'}
                      </p>
                      {workout.isCompleted && workout.completedAt && (
                        <p className="text-sm text-text-muted">
                          Concluído em {formatDateTime(workout.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  {!workout.isCompleted && onMarkAsCompleted && (
                    <button
                      onClick={() => onMarkAsCompleted(workout.id)}
                      disabled={isMarkingComplete}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isMarkingComplete ? 'Marcando...' : 'Marcar como Feito'}
                    </button>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-card rounded-xl border border-border text-center">
                    <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{workout.duration}</p>
                    <p className="text-sm text-text-muted">minutos</p>
                  </div>
                  
                  {workout.calories && (
                    <div className="p-4 bg-card rounded-xl border border-border text-center">
                      <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{workout.calories}</p>
                      <p className="text-sm text-text-muted">calorias</p>
                    </div>
                  )}

                  <div className="p-4 bg-card rounded-xl border border-border text-center">
                    <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-foreground">{formatDate(workout.createdAt)}</p>
                    <p className="text-sm text-text-muted">criado em</p>
                  </div>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="p-4 bg-card rounded-xl border border-border text-center">
                      <Dumbbell className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{workout.exercises.length}</p>
                      <p className="text-sm text-text-muted">exercícios</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {workout.description && (
                  <div className="p-4 bg-card rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                    <p className="text-text-muted leading-relaxed">{workout.description}</p>
                  </div>
                )}

                {/* Exercises */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="p-4 bg-card rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-accent" />
                      Exercícios ({workout.exercises.length})
                    </h3>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{exercise.name}</p>
                            {exercise.description && (
                              <p className="text-sm text-text-muted mt-1">{exercise.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            {exercise.sets && (
                              <div className="text-center">
                                <p className="font-semibold text-foreground">{exercise.sets}</p>
                                <p className="text-xs">séries</p>
                              </div>
                            )}
                            {exercise.reps && (
                              <div className="text-center">
                                <p className="font-semibold text-foreground">{exercise.reps}</p>
                                <p className="text-xs">reps</p>
                              </div>
                            )}
                            {exercise.weight && (
                              <div className="text-center">
                                <p className="font-semibold text-foreground">{exercise.weight}kg</p>
                                <p className="text-xs">peso</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(workout)}
                      className="flex-1 bg-gradient-to-r from-accent/20 to-yellow-300/20 hover:from-accent/30 hover:to-yellow-300/30 text-accent font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar Treino
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(workout)}
                      className="flex-1 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-500 font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir Treino
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

