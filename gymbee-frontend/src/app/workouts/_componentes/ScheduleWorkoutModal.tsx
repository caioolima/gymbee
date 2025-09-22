'use client';

import { motion } from 'framer-motion';
import { X, Calendar, Clock, Dumbbell, Activity, Zap, Target, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { WorkoutType, CreateWorkoutRequest } from '@/types/workouts';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { toast } from 'sonner';

interface ScheduleWorkoutModalProps {
  selectedDate: Date | null;
  onClose: () => void;
}

export function ScheduleWorkoutModal({ selectedDate, onClose }: ScheduleWorkoutModalProps) {
  const { createWorkout, isCreating } = useWorkouts();
  const [formData, setFormData] = useState<CreateWorkoutRequest>({
    type: WorkoutType.STRENGTH,
    name: '',
    description: '',
    duration: 60,
    calories: 0,
    exercises: [],
    notes: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration) {
      toast.error('Nome e duração são obrigatórios');
      return;
    }

    createWorkout(formData);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!selectedDate) return null;

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
            <h2 className="text-3xl font-bold text-foreground">Agendar Treino</h2>
            <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedDate)}
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

          {/* Nome e Descrição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descrição (opcional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ex: Foco em força e hipertrofia"
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Duração e Calorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Calorias Esperadas (opcional)</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 400"
                min="0"
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Exercícios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">Exercícios (opcional)</label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  exercises: [...(prev.exercises || []), { name: '', sets: 1, reps: 1 }]
                }))}
                className="flex items-center gap-1 px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Adicionar Exercício
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.exercises?.map((exercise, index) => (
                <div key={index} className="flex items-center gap-3 bg-input-bg p-3 rounded-lg border border-input-border">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => {
                      const newExercises = [...(formData.exercises || [])];
                      newExercises[index] = { ...exercise, name: e.target.value };
                      setFormData(prev => ({ ...prev, exercises: newExercises }));
                    }}
                    placeholder="Nome do Exercício"
                    className="flex-1 px-3 py-2 bg-transparent border-b border-border/50 text-foreground focus:outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => {
                      const newExercises = [...(formData.exercises || [])];
                      newExercises[index] = { ...exercise, sets: parseInt(e.target.value) || 1 };
                      setFormData(prev => ({ ...prev, exercises: newExercises }));
                    }}
                    placeholder="Séries"
                    min="1"
                    className="w-20 px-3 py-2 bg-transparent border-b border-border/50 text-foreground text-center focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={exercise.reps}
                    onChange={(e) => {
                      const newExercises = [...(formData.exercises || [])];
                      newExercises[index] = { ...exercise, reps: e.target.value };
                      setFormData(prev => ({ ...prev, exercises: newExercises }));
                    }}
                    placeholder="Repetições"
                    className="w-24 px-3 py-2 bg-transparent border-b border-border/50 text-foreground text-center focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newExercises = formData.exercises?.filter((_, i) => i !== index) || [];
                      setFormData(prev => ({ ...prev, exercises: newExercises }));
                    }}
                    className="p-2 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Observações (opcional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ex: Foco na técnica, treino intenso..."
              rows={3}
              className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Agendando...
                </>
              ) : (
                'Agendar Treino'
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
