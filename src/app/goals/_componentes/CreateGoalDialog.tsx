'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Target, Calendar, Scale, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useGoals } from '@/hooks/useGoalsQuery';
import toast from 'react-hot-toast';

interface CreateGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function CreateGoalDialog({ isOpen, onClose, user }: CreateGoalDialogProps) {
  const [formData, setFormData] = useState({
    goalType: 'GAIN_MASS',
    currentWeight: '',
    targetWeight: '',
    height: '',
    activityLevel: 'MODERATE',
    experienceLevel: 'INTERMEDIATE',
    deadline: '',
  });
  const { createGoal, isCreating } = useGoals();

  const goalTypes = [
    { value: 'GAIN_MASS', label: 'Ganhar Massa', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { value: 'LOSE_WEIGHT', label: 'Perder Peso', icon: TrendingDown, color: 'from-red-500 to-orange-500' },
    { value: 'IMPROVE_CONDITIONING', label: 'Melhorar Condicionamento', icon: Activity, color: 'from-blue-500 to-cyan-500' },
  ];

  const activityLevels = [
    { value: 'SEDENTARY', label: 'Sedentário' },
    { value: 'LIGHT', label: 'Leve' },
    { value: 'MODERATE', label: 'Moderado' },
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'VERY_ACTIVE', label: 'Muito Ativo' },
  ];

  const experienceLevels = [
    { value: 'BEGINNER', label: 'Iniciante' },
    { value: 'INTERMEDIATE', label: 'Intermediário' },
    { value: 'ADVANCED', label: 'Avançado' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar dados
    if (!formData.currentWeight || !formData.targetWeight || !formData.height) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const goalData = {
      goalType: formData.goalType,
      currentWeight: Number(formData.currentWeight),
      targetWeight: Number(formData.targetWeight),
      height: Number(formData.height),
      activityLevel: formData.activityLevel,
      experienceLevel: formData.experienceLevel,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    };

    createGoal(goalData);
    
    // Reset form
    setFormData({
      goalType: 'GAIN_MASS',
      currentWeight: '',
      targetWeight: '',
      height: '',
      activityLevel: 'MODERATE',
      experienceLevel: 'INTERMEDIATE',
      deadline: '',
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Criar Novo Objetivo</h2>
              <p className="text-text-muted text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Defina sua meta fitness e comece sua jornada
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
          {/* Tipo de Objetivo */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">Tipo de Objetivo</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {goalTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.goalType === type.value;
                      
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('goalType', type.value)}
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

                {/* Weight and Height */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Peso Atual (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="30"
                        max="300"
                        value={formData.currentWeight}
                        onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                        placeholder="Ex: 70.5"
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        required
                      />
                      <Scale className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Peso Alvo (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="30"
                        max="300"
                        value={formData.targetWeight}
                        onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                        placeholder="Ex: 75.0"
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        required
                      />
                      <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Altura (cm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="100"
                        max="250"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="Ex: 170"
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">
                        cm
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity and Experience Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nível de Atividade
                    </label>
                    <select
                      value={formData.activityLevel}
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    >
                      {activityLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nível de Experiência
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Prazo (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                  </div>
                </div>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-6 border-t border-border/20">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating || !formData.currentWeight || !formData.targetWeight || !formData.height}
                className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Criando...
                  </div>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Criar Objetivo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
