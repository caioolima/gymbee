'use client';

import { motion } from 'framer-motion';
import { Target, Calendar, TrendingDown, TrendingUp, Scale, Edit, Trash2, X, Trophy, Star, Zap, CheckCircle } from 'lucide-react';
import { useActiveGoal } from '@/hooks/useActiveGoalQuery';
import { useGoals } from '@/hooks/useGoalsQuery';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

interface ActiveGoalCardProps {
  user: any;
}

export function ActiveGoalCard({ user }: ActiveGoalCardProps) {
  const { goalData, isLoading, error, registerWeight, isRegisteringWeight } = useActiveGoal();
  const { updateGoal, isUpdating } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  
  // Estados para o dialog de edição
  const [editForm, setEditForm] = useState({
    goalType: '',
    currentWeight: '',
    targetWeight: '',
    deadline: ''
  });

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'LOSE_WEIGHT':
        return TrendingDown;
      case 'GAIN_MASS':
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getGoalLabel = (goalType: string) => {
    switch (goalType) {
      case 'LOSE_WEIGHT':
        return 'Perder Peso';
      case 'GAIN_MASS':
        return 'Ganhar Massa';
      case 'IMPROVE_CONDITIONING':
        return 'Melhorar Condicionamento';
      default:
        return 'Objetivo';
    }
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const weightValue = parseFloat(weight);
    
    if (isNaN(weightValue) || weightValue < 30 || weightValue > 300) {
      toast.error('Peso deve estar entre 30 e 300 kg');
      return;
    }
    
    registerWeight({
      weight: weightValue,
      notes: notes || undefined,
    });

    setWeight('');
    setNotes('');
    setIsDialogOpen(false);
  };

  const handleEditDialogOpen = () => {
    if (goalData) {
      setEditForm({
        goalType: goalData.goalType,
        currentWeight: goalData.currentWeight.toString(),
        targetWeight: goalData.targetWeight.toString(),
        deadline: goalData.deadline ? new Date(goalData.deadline).toISOString().split('T')[0] : ''
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentWeight = parseFloat(editForm.currentWeight);
    const targetWeight = parseFloat(editForm.targetWeight);
    
    if (isNaN(currentWeight) || currentWeight < 30 || currentWeight > 300) {
      toast.error('Peso atual deve estar entre 30 e 300 kg');
      return;
    }
    
    if (isNaN(targetWeight) || targetWeight < 30 || targetWeight > 300) {
      toast.error('Peso alvo deve estar entre 30 e 300 kg');
      return;
    }
    
    if (currentWeight === targetWeight) {
      toast.error('Peso alvo deve ser diferente do peso atual');
      return;
    }
    
    if (editForm.deadline && new Date(editForm.deadline) <= new Date()) {
      toast.error('Prazo deve ser uma data futura');
      return;
    }
    
    if (!goalData?.id) {
      toast.error('ID do objetivo não encontrado');
      return;
    }
    
    const updateData = {
      goalType: editForm.goalType,
      currentWeight: currentWeight,
      targetWeight: targetWeight,
      deadline: editForm.deadline ? new Date(editForm.deadline).toISOString() : undefined
    };
    
    updateGoal(goalData.id, updateData);
    setIsEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-6 animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-input-bg rounded-xl"></div>
            <div>
              <div className="h-4 bg-input-bg rounded w-32 mb-2"></div>
              <div className="h-3 bg-input-bg rounded w-24"></div>
            </div>
          </div>
          <div className="h-6 bg-input-bg rounded w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-input-bg rounded w-full"></div>
          <div className="h-3 bg-input-bg rounded w-3/4"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Erro ao carregar objetivo
        </h3>
        <p className="text-text-muted">
          Ocorreu um problema ao carregar seus dados. Tente novamente.
        </p>
      </motion.div>
    );
  }

  if (!goalData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-border rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum objetivo ativo
        </h3>
        <p className="text-text-muted mb-4">
          Crie seu primeiro objetivo para começar sua jornada fitness!
        </p>
      </motion.div>
    );
  }

  const GoalIcon = getGoalIcon(goalData.goalType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
            <GoalIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {getGoalLabel(goalData.goalType)}
            </h3>
            <p className="text-sm text-text-muted">
              {goalData.currentWeight}kg → {goalData.targetWeight}kg
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{goalData.progress}%</p>
          <p className="text-xs text-text-muted">Progresso</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-input-bg rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-accent to-yellow-300 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${goalData.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-input-bg/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-muted">Peso Atual</span>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-1 px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded text-xs font-medium transition-all duration-200 cursor-pointer"
            >
              <Scale className="w-3 h-3" />
              Atualizar
            </button>
            
            {isDialogOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                        <Scale className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Atualizar Peso</h2>
                        <p className="text-text-muted text-sm flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Registre sua pesagem atual
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                      
                  <form onSubmit={handleWeightSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Peso Atual (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="30"
                        max="300"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ex: 75.5"
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Observações (opcional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Pesagem matinal, após treino..."
                        className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-between pt-6 border-t border-border/20">
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isRegisteringWeight || !weight}
                          className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                        >
                          {isRegisteringWeight ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                              Registrando...
                            </div>
                          ) : (
                            <>
                              <Scale className="w-4 h-4" />
                              Atualizar Peso
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
          <p className="text-xl font-bold text-foreground">{goalData.currentWeight} kg</p>
          <p className="text-xs text-text-muted">BMI: {goalData.currentBMI}</p>
        </div>
        
        <div className="bg-input-bg/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-muted">Meta</span>
          </div>
          <p className="text-xl font-bold text-foreground">{goalData.targetWeight} kg</p>
          <p className="text-xs text-text-muted">BMI: {goalData.targetBMI}</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Prazo</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {goalData.daysRemaining !== null 
              ? `${goalData.daysRemaining} dias`
              : 'Sem prazo'
            }
          </p>
          <p className="text-xs text-text-muted">
            {goalData.daysRemaining !== null ? 'restantes' : 'definido'}
          </p>
        </div>
        
        <div className="bg-slate-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {goalData.weightDifference < 0 ? (
              <TrendingDown className="w-5 h-5 text-accent" />
            ) : (
              <TrendingUp className="w-5 h-5 text-orange-500" />
            )}
            <span className="text-sm font-semibold text-accent">Diferença</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {Math.abs(goalData.weightDifference).toFixed(1)} kg
          </p>
          <p className="text-xs text-text-muted">
            {goalData.weightDifference < 0 ? 'para perder' : 'para ganhar'}
          </p>
        </div>
        
        <div className="bg-slate-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Progresso</span>
          </div>
          <p className="text-lg font-bold text-foreground">{goalData.progress}%</p>
          <p className="text-xs text-text-muted">concluído</p>
        </div>
      </div>

      {/* Goal Insights */}
      <div className="bg-gradient-to-r from-accent/10 to-yellow-300/10 rounded-lg p-4 mb-6 border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {goalData.progress >= 100 ? (
              <Trophy className="w-4 h-4 text-accent" />
            ) : goalData.progress >= 75 ? (
              <Star className="w-4 h-4 text-accent" />
            ) : goalData.progress >= 50 ? (
              <CheckCircle className="w-4 h-4 text-accent" />
            ) : goalData.progress >= 25 ? (
              <Zap className="w-4 h-4 text-accent" />
            ) : (
              <Target className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Insight do Progresso</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              {goalData.progress >= 100 
                ? "Parabéns! Você alcançou seu objetivo! Continue mantendo seus hábitos saudáveis."
                : goalData.progress >= 75
                ? "Excelente progresso! Você está muito próximo de alcançar sua meta. Mantenha o foco!"
                : goalData.progress >= 50
                ? "Bom progresso! Você está na metade do caminho. Continue com consistência!"
                : goalData.progress >= 25
                ? "Ótimo começo! Você já fez um quarto do caminho. Mantenha a motivação!"
                : "Começando bem! Cada pequeno passo conta. Continue focado no seu objetivo!"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border justify-center">
        <button 
          onClick={handleEditDialogOpen}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg transition-all duration-200 cursor-pointer">
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>

      {/* Edit Goal Dialog */}
      {isEditDialogOpen && (
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
                  <Edit className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Editar Objetivo</h2>
                  <p className="text-text-muted text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Atualize os dados do seu objetivo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
                
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Tipo de Objetivo */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">Tipo de Objetivo</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'LOSE_WEIGHT', label: 'Perder Peso', icon: TrendingDown, color: 'from-red-500 to-red-600' },
                    { value: 'GAIN_MASS', label: 'Ganhar Massa', icon: TrendingUp, color: 'from-green-500 to-green-600' },
                    { value: 'IMPROVE_CONDITIONING', label: 'Melhorar Condicionamento', icon: Target, color: 'from-blue-500 to-blue-600' }
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = editForm.goalType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, goalType: type.value }))}
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
                  
              {/* Peso Atual e Alvo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Peso Atual (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={editForm.currentWeight}
                    onChange={(e) => setEditForm(prev => ({ ...prev, currentWeight: e.target.value }))}
                    placeholder="Ex: 75.5"
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Peso Alvo (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={editForm.targetWeight}
                    onChange={(e) => setEditForm(prev => ({ ...prev, targetWeight: e.target.value }))}
                    placeholder="Ex: 70.0"
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
                  
              {/* Prazo */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Prazo (opcional)</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between pt-6 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating || !editForm.currentWeight || !editForm.targetWeight}
                    className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
