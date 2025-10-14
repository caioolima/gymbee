'use client';

import { motion } from 'framer-motion';
import { Target, Calendar, TrendingDown, TrendingUp, Minus, Loader2, Scale, X, ArrowRight } from 'lucide-react';
import { useActiveGoal } from '@/hooks/useActiveGoalQuery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

interface ActiveGoalCardProps {
  user: any;
}

export function ActiveGoalCard({ user }: ActiveGoalCardProps) {
  const { goalData, isLoading, error, registerWeight, isRegisteringWeight } = useActiveGoal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

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
    
    // Garantir que o peso seja um número válido
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

  // Estados de loading e erro
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
      >
        <div className="relative z-10">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse mb-1"></div>
              <div className="h-10 w-48 bg-slate-700/50 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-32 bg-slate-600/50 rounded animate-pulse"></div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700/30 via-slate-600/20 to-slate-700/30 rounded-2xl flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-slate-500/50 rounded"></div>
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mb-6">
            <div className="w-full bg-slate-700/30 rounded-full h-3 animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/30 rounded-lg p-5 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-slate-600/50 rounded"></div>
                  <div className="h-4 w-20 bg-slate-600/50 rounded"></div>
                </div>
                <div className="h-6 w-24 bg-slate-600/50 rounded"></div>
              </div>
              <div className="h-10 w-16 bg-slate-600/50 rounded mb-1"></div>
              <div className="h-4 w-20 bg-slate-600/50 rounded"></div>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-5 animate-pulse">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-slate-600/50 rounded"></div>
                <div className="h-4 w-12 bg-slate-600/50 rounded"></div>
              </div>
              <div className="h-10 w-16 bg-slate-600/50 rounded mb-1"></div>
              <div className="h-4 w-20 bg-slate-600/50 rounded"></div>
            </div>
          </div>

          {/* Bottom Info Skeleton */}
          <div className="bg-slate-800/20 rounded-lg p-5 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-slate-600/50 rounded"></div>
                <div>
                  <div className="h-3 w-12 bg-slate-600/50 rounded mb-1"></div>
                  <div className="h-5 w-24 bg-slate-600/50 rounded"></div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="h-3 w-16 bg-slate-600/50 rounded mb-1"></div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-600/50 rounded"></div>
                  <div className="h-8 w-12 bg-slate-600/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center">
            <div className="h-10 w-32 bg-slate-700/30 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-accent" />
          </div>
          
          <h3 className="text-3xl font-bold text-foreground mb-3">
            {error ? 'Erro ao carregar objetivo' : 'Nenhum objetivo ativo'}
          </h3>
          
          <p className="text-base text-text-muted mb-6 max-w-md mx-auto">
            {error 
              ? 'Ocorreu um problema ao carregar seus dados. Tente novamente em alguns instantes.'
              : 'Defina seu primeiro objetivo fitness e comece sua jornada de transformação!'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 cursor-pointer bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {error ? 'Tentar Novamente' : 'Criar Objetivo'}
            </button>
            
            {!error && (
              <button
                onClick={() => window.location.href = '/fitness-questions'}
                className="px-6 py-3 bg-transparent border border-accent text-accent hover:bg-accent/10 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
              >
                Questionário Fitness
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Se não há objetivo ativo (goalData é null)
  if (!goalData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-accent" />
          </div>
          
          <h3 className="text-3xl font-bold text-foreground mb-3">
            Nenhum objetivo ativo
          </h3>
          
          <p className="text-base text-text-muted mb-6 max-w-md mx-auto">
            Defina seu primeiro objetivo fitness e comece sua jornada de transformação!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/fitness-questions'}
              className="px-8 py-4 cursor-pointer bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Criar Objetivo
            </button>
            
            <button
              onClick={() => window.location.href = '/fitness-questions'}
              className="px-6 py-3 bg-transparent border border-accent text-accent hover:bg-accent/10 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
            >
              Questionário Fitness
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const GoalIcon = getGoalIcon(goalData.goalType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
    >
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-base text-text-muted font-semibold">Objetivo Ativo</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-accent via-yellow-400 to-amber-500 bg-clip-text text-transparent mt-1">
              {getGoalLabel(goalData.goalType)}
            </p>
            <p className="text-base font-semibold text-foreground mt-1">
              {goalData.progress}% concluído
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <GoalIcon className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-input-bg rounded-full h-3 overflow-hidden relative">
            <motion.div
              className="bg-gradient-to-r from-accent via-yellow-400 to-amber-500 h-3 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${goalData.progress}%` }}
              transition={{ 
                duration: 1.5, 
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 2, 
                  delay: 2,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/30 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                <span className="text-base font-semibold text-accent">Peso Atual</span>
              </div>
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger asChild>
                  <button
                    className="flex items-center gap-1 px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded text-xs font-medium transition-all duration-200 cursor-pointer"
                  >
                    <Scale className="w-4 h-4" />
                    Atualizar Peso
                  </button>
                </Dialog.Trigger>
                
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
                  <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-card-bg to-card-bg/95 backdrop-blur-sm border border-border/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5 rounded-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl flex items-center justify-center">
                            <Scale className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <Dialog.Title className="text-2xl font-bold text-foreground">
                              Atualizar Peso
                            </Dialog.Title>
                            <p className="text-sm text-text-muted">
                              Registre sua pesagem atual
                            </p>
                          </div>
                        </div>
                        <Dialog.Close asChild>
                          <button className="w-10 h-10 bg-input-bg/50 hover:bg-input-bg border border-border/50 rounded-xl flex items-center justify-center text-text-muted hover:text-foreground transition-all duration-200 cursor-pointer group">
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                          </button>
                        </Dialog.Close>
                      </div>
                      
                      <form onSubmit={handleWeightSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Peso Atual (kg)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              min="30"
                              max="300"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              placeholder="Ex: 75.5"
                              className="w-full px-4 py-4 bg-input-bg border border-input-border rounded-xl text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-accent/50"
                              required
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted text-sm">
                              kg
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Observações (opcional)
                          </label>
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ex: Pesagem matinal, após treino..."
                            className="w-full px-4 py-4 bg-input-bg border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-accent/50"
                          />
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <button
                            type="submit"
                            disabled={isRegisteringWeight || !weight}
                            className="flex-1 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                          >
                            {isRegisteringWeight ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                Registrando...
                              </div>
                            ) : (
                              'Atualizar Peso'
                            )}
                          </button>
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              className="px-6 py-4 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 cursor-pointer font-medium"
                            >
                              Cancelar
                            </button>
                          </Dialog.Close>
                        </div>
                      </form>
                    </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
             <p className="text-4xl font-bold text-foreground">{goalData.currentWeight} kg</p>
             <p className="text-base text-text-muted font-medium">BMI: {goalData.currentBMI}</p>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-base font-semibold text-accent">Meta</span>
            </div>
             <p className="text-4xl font-bold text-foreground">{goalData.targetWeight} kg</p>
             <p className="text-base text-text-muted font-medium">BMI: {goalData.targetBMI}</p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-slate-800/20 rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-accent" />
              <div>
                <p className="text-sm font-semibold text-accent mb-1">Prazo</p>
                <p className="text-lg text-foreground font-medium">
                  {goalData.daysRemaining !== null 
                    ? `${goalData.daysRemaining} dias restantes`
                    : 'Sem prazo definido'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-accent mb-1">Diferença</p>
              <div className="flex items-center gap-3">
                {goalData.weightDifference < 0 ? (
                  <TrendingDown className="w-6 h-6 text-accent" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                )}
                <span className="text-3xl font-bold text-foreground">
                  {Math.abs(goalData.weightDifference).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ver Objetivos Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/goals')}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            Ver Objetivos
          </button>
        </div>

      </div>
    </motion.div>
  );
}

