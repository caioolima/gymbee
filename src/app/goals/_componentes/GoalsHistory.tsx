'use client';

import { motion } from 'framer-motion';
import { Calendar, Target, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useGoals } from '@/hooks/useGoalsQuery';

interface GoalsHistoryProps {
  user: any;
}

export function GoalsHistory({ user }: GoalsHistoryProps) {
  const { goals, isLoading, error } = useGoals();

  // Filtrar objetivos históricos (que não são ativos)
  // Um objetivo é considerado histórico se:
  // 1. Tem progresso >= 100% (concluído)
  // 2. Tem deadline e o deadline já passou (se existir)
  const historicalGoals = goals.filter(goal => {
    // Se tem progresso 100%, é histórico (concluído)
    if (goal.progress >= 100) {
      return true;
    }
    // Se tem deadline e já passou, é histórico
    if (goal.deadline && new Date(goal.deadline) < new Date()) {
      return true;
    }
    return false;
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

  const getStatusIcon = (goal: any) => {
    if (goal.progress >= 100) return CheckCircle;
    if (new Date(goal.deadline) < new Date()) return Clock;
    return Target;
  };

  const getStatusColor = (goal: any) => {
    if (goal.progress >= 100) return 'text-green-500';
    if (new Date(goal.deadline) < new Date()) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getStatusLabel = (goal: any) => {
    if (goal.progress >= 100) return 'Concluído';
    if (new Date(goal.deadline) < new Date()) return 'Expirado';
    return 'Em andamento';
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card-bg border border-border rounded-xl p-6 animate-pulse">
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
          </div>
        ))}
      </div>
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
          Erro ao carregar histórico
        </h3>
        <p className="text-text-muted">
          Ocorreu um problema ao carregar seus objetivos. Tente novamente.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {historicalGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-bg border border-border rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum objetivo no histórico
          </h3>
          <p className="text-text-muted">
            Crie seu primeiro objetivo para começar sua jornada fitness!
          </p>
        </motion.div>
      ) : (
        historicalGoals.map((goal, index) => {
          const GoalIcon = getGoalIcon(goal.goalType);
          const StatusIcon = getStatusIcon(goal);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                    <GoalIcon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {getGoalLabel(goal.goalType)}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {goal.currentWeight}kg → {goal.targetWeight}kg
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 ${getStatusColor(goal)}`} />
                  <span className={`text-sm font-medium ${getStatusColor(goal)}`}>
                    {getStatusLabel(goal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-text-muted mb-1">
                    <span>Progresso</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-input-bg rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                    </span>
                  </div>
                  
                  {goal.progress >= 100 && (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Concluído em {new Date(goal.updatedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {new Date(goal.deadline) < new Date() && goal.progress < 100 && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <Clock className="w-4 h-4" />
                      <span>Expirado em {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
