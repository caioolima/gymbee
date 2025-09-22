'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Dumbbell, 
  Activity, 
  Zap, 
  Target, 
  Plus, 
  Trash2,
  Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Workout, WorkoutType } from '@/types/workouts';

interface Exercise {
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

interface EditWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout | null;
  onSave: (workoutId: string, workoutData: any) => void;
  isSaving?: boolean;
}

export function EditWorkoutDialog({
  isOpen,
  onClose,
  workout,
  onSave,
  isSaving = false
}: EditWorkoutDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 0,
    calories: 0,
    type: WorkoutType.STRENGTH,
    exercises: [] as Exercise[]
  });

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name || '',
        description: workout.description || '',
        duration: workout.duration || 0,
        calories: workout.calories || 0,
        type: workout.type || WorkoutType.STRENGTH,
        exercises: workout.exercises || []
      });
    }
  }, [workout]);

  const workoutTypes = [
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-red-500 to-red-600' },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-blue-500 to-blue-600' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-green-500 to-green-600' },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-purple-500 to-purple-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workout || !formData.name || !formData.duration) {
      return;
    }

    const workoutData = {
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      calories: formData.calories || 0,
      type: formData.type,
      exercises: formData.exercises
    };

    onSave(workout.id, workoutData);
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: 0, reps: 0, weight: 0 }]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  if (!isOpen || !workout) return null;

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
                  <div className="p-3 rounded-xl bg-gradient-to-r from-accent/20 to-yellow-300/20">
                    <Dumbbell className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Editar Treino
                    </h2>
                    <p className="text-text-muted">
                      Modifique os detalhes do seu treino
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome do Treino *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                      placeholder="Ex: Treino de Peito"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="Descreva o treino..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Duração (min) *
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        placeholder="60"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Calorias
                      </label>
                      <input
                        type="number"
                        value={formData.calories}
                        onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        placeholder="300"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Workout Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Tipo de Treino
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {workoutTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = formData.type === type.value;
                      
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? `border-accent bg-gradient-to-r ${type.color} text-white`
                              : 'border-border bg-card hover:border-accent/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Exercícios
                    </label>
                    <button
                      type="button"
                      onClick={addExercise}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-accent/20 to-yellow-300/20 hover:from-accent/30 hover:to-yellow-300/30 text-accent font-medium rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.exercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-card rounded-xl border border-border"
                      >
                        <div className="flex items-end gap-3 mb-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-text-muted mb-1">
                              Nome do exercício
                            </label>
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                              placeholder="Ex: Supino reto"
                            />
                          </div>
                          <div className="w-20">
                            <label className="block text-xs font-medium text-text-muted mb-1">
                              Séries
                            </label>
                            <input
                              type="number"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                              placeholder="3"
                              min="0"
                            />
                          </div>
                          <div className="w-20">
                            <label className="block text-xs font-medium text-text-muted mb-1">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                              placeholder="12"
                              min="0"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 text-gray-600 font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !formData.name || !formData.duration}
                    className="flex-1 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

