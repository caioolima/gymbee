'use client';

import { motion } from 'framer-motion';
import { Dumbbell, X, Target, Activity, Zap } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { WorkoutType, CreateWorkoutRequest } from '@/types/workouts';
import { useState } from 'react';

interface RegisterWorkoutModalProps {
  onClose: () => void;
}

export function RegisterWorkoutModal({ onClose }: RegisterWorkoutModalProps) {
  const { createWorkout, isCreating } = useWorkouts();
  const [formData, setFormData] = useState<CreateWorkoutRequest>({
    type: WorkoutType.STRENGTH,
    name: '',
    duration: 60,
  });

  const workoutTypes = [
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-accent via-yellow-400 to-amber-500' },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-yellow-500 to-orange-500' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-orange-500 to-accent' },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-amber-600 via-accent to-yellow-300' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Preparar dados para envio - apenas campos preenchidos
    const workoutData = {
      type: formData.type as WorkoutType,
      name: formData.name.trim(),
      duration: formData.duration,
    };

    createWorkout(workoutData);
    onClose();
  };

  return (
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
            <h2 className="text-3xl font-bold text-foreground">Registrar Treino</h2>
            <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Registre seu treino agora
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Treino */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Tipo de Treino</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {workoutTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                        : 'bg-input-bg border-border/50 text-text-muted hover:bg-input-bg/70 hover:text-foreground'
                    } cursor-pointer`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nome do Treino */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nome do Treino</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Treino de Peito e Tríceps"
              className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Duração (minutos)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              placeholder="Ex: 60"
              min="1"
              className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              disabled={isCreating || !formData.name.trim()}
              className="bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar Treino'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
