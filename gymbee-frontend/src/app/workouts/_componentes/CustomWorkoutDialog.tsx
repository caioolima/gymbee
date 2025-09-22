'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Dumbbell, Activity, Zap, Target, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { WorkoutType, CreateWorkoutRequest, Exercise } from '@/types/workouts';

interface CustomWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onWorkoutCreated?: (workout: any) => void;
}

export function CustomWorkoutDialog({ isOpen, onClose, selectedDate, onWorkoutCreated }: CustomWorkoutDialogProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration) {
      return;
    }

    const workoutData = {
      ...formData,
      scheduledDate: selectedDate.toISOString(),
      source: 'user-created', // Marcar como treino criado pelo usuário
    };

    try {
      // Retornar os dados do treino para o modal pai (não criar ainda)
      onWorkoutCreated?.({
        ...workoutData,
        exercises: formData.exercises || []
      });
      onClose();
    } catch (error) {
      console.error('Erro ao preparar treino:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: WorkoutType.STRENGTH,
      name: '',
      description: '',
      duration: 60,
      calories: 0,
      exercises: [],
      notes: '',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Criar Treino Personalizado</h2>
                <p className="text-text-muted text-sm flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  {formatDate(selectedDate)}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Treino */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">Tipo de Treino</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {workoutTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg transform scale-[1.02]`
                          : 'bg-input-bg/50 border-border/30 text-text-muted hover:bg-input-bg hover:text-foreground hover:border-accent/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nome e Descrição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nome do Treino</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Treino de Peito e Tríceps"
                  className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Descrição (opcional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Foco em força e hipertrofia"
                  className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Duração e Calorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Duração (minutos)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 60"
                  min="1"
                  className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Calorias Esperadas (opcional)</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 400"
                  min="0"
                  className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Exercícios */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-foreground">Exercícios</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    exercises: [...(prev.exercises || []), { name: '', sets: 1, reps: 1 }]
                  }))}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 hover:from-accent/20 hover:to-yellow-300/20 text-accent border border-accent/30 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Exercício
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {formData.exercises?.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-input-bg/60 to-input-bg/40 p-4 rounded-xl border border-border/20"
                  >
                    <div className="flex items-end gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-300 rounded-lg flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => {
                            const newExercises = [...(formData.exercises || [])];
                            newExercises[index] = { ...exercise, name: e.target.value };
                            setFormData(prev => ({ ...prev, exercises: newExercises }));
                          }}
                          placeholder="Nome do exercício"
                          className="w-full px-3 py-2 bg-transparent border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="flex items-end gap-2 flex-shrink-0">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-text-muted mb-1">Séries</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => {
                              const newExercises = [...(formData.exercises || [])];
                              newExercises[index] = { ...exercise, sets: parseInt(e.target.value) || 1 };
                              setFormData(prev => ({ ...prev, exercises: newExercises }));
                            }}
                            placeholder="3"
                            min="1"
                            className="w-16 px-2 py-2 bg-transparent border border-border/50 rounded-lg text-foreground text-sm text-center focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-text-muted mb-1">Reps</label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => {
                              const newExercises = [...(formData.exercises || [])];
                              newExercises[index] = { ...exercise, reps: e.target.value };
                              setFormData(prev => ({ ...prev, exercises: newExercises }));
                            }}
                            placeholder="10"
                            className="w-16 px-2 py-2 bg-transparent border border-border/50 rounded-lg text-foreground text-sm text-center focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newExercises = (formData.exercises || []).filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, exercises: newExercises }));
                        }}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 cursor-pointer flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Observações (opcional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Ex: Foco na técnica, treino intenso..."
                rows={3}
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y transition-all duration-200"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between pt-6 border-t border-border/20">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Limpar
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Criar Treino
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
