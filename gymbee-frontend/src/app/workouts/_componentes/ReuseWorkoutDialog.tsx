'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, Dumbbell, Activity, Zap, Target, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Workout, WorkoutType } from '@/types/workouts';

interface ReuseWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
}

export function ReuseWorkoutDialog({ isOpen, onClose, workouts, onSelectWorkout }: ReuseWorkoutDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');


  const workoutTypes = [
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-red-500 to-red-600' },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-blue-500 to-blue-600' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-green-500 to-green-600' },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-purple-500 to-purple-600' },
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

  const filteredWorkouts = workouts.filter(workout =>
    workout.source === 'user-created' && // Só mostrar treinos criados pelo usuário
    (workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectWorkout = (workout: Workout) => {
    onSelectWorkout(workout);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Reutilizar Treino</h2>
                <p className="text-text-muted text-sm">
                  Escolha um treino personalizado para reutilizar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar treinos personalizados..."
                className="w-full pl-10 pr-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Workouts List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-input-bg to-input-bg/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'Nenhum treino encontrado' : 'Nenhum treino personalizado disponível'}
                </h3>
                <p className="text-text-muted">
                  {searchTerm ? 'Tente buscar com outros termos' : 'Crie seu primeiro treino personalizado para poder reutilizá-lo'}
                </p>
              </div>
            ) : (
              filteredWorkouts.map((workout, index) => {
                const WorkoutIcon = getWorkoutTypeIcon(workout.type);
                const color = getWorkoutTypeColor(workout.type);
                
                return (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectWorkout(workout)}
                    className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 p-4 rounded-xl border border-border/20 hover:border-accent/30 cursor-pointer transition-all duration-200 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <WorkoutIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-foreground mb-1 truncate">
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
                          {workout.exercises && workout.exercises.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Dumbbell className="w-4 h-4" />
                              <span>{workout.exercises.length} exercícios</span>
                            </div>
                          )}
                        </div>
                        {workout.description && (
                          <p className="text-sm text-text-muted mt-2 line-clamp-2">
                            {workout.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <RotateCcw className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
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
