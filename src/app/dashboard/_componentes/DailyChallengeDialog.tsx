'use client';

import { motion } from 'framer-motion';
import { X, Target, Trophy, CheckCircle, Loader2, Calendar, Star, Bot, Sparkles, Brain, Zap } from 'lucide-react';

interface DailyChallengeDialogProps {
  challenge: {
    id: string;
    challenge: {
      id: string;
      title: string;
      description: string;
      points: number;
      goalType: string;
    };
    date: string;
    isAccepted: boolean;
    isCompleted: boolean;
    completedAt: string | null;
    createdAt: string;
  };
  onClose: () => void;
  onAccept: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
  isAccepting: boolean;
  isCompleting: boolean;
}

export function DailyChallengeDialog({ 
  challenge, 
  onClose, 
  onAccept,
  onComplete, 
  isAccepting,
  isCompleting 
}: DailyChallengeDialogProps) {
  const handleAccept = () => {
    if (!challenge.isAccepted && !challenge.isCompleted) {
      onAccept(challenge.id);
    }
  };

  const handleComplete = () => {
    if (challenge.isAccepted && !challenge.isCompleted) {
      onComplete(challenge.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              {/* AI Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-foreground">Desafio Diário</h2>
                <div className="flex items-center gap-1 bg-gradient-to-r from-accent/20 to-yellow-400/20 border border-accent/30 rounded-full px-2 py-0.5">
                  <Brain className="w-3 h-3 text-accent" />
                  <span className="text-xs font-medium text-accent">IA</span>
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <p className="text-text-muted text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(challenge.date).toLocaleDateString('pt-BR')}
                <span className="text-accent">• Personalizado para você</span>
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

        {/* Content */}
        <div className="space-y-6">
          {/* AI Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  Criado por IA
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  Este desafio foi personalizado especialmente para você baseado no seu objetivo atual, 
                  nível de experiência e histórico de treinos. Nossa IA analisou seu perfil para 
                  criar o desafio mais eficaz!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Challenge Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {challenge.challenge.title}
            </h3>
            <p className="text-text-muted leading-relaxed">
              {challenge.challenge.description}
            </p>
          </div>

          {/* Points and Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-300 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{challenge.challenge.points} pontos</p>
                <p className="text-xs text-text-muted">Recompensa</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {challenge.challenge.goalType === 'GAIN_MASS' ? 'Ganhar Massa' : 
                   challenge.challenge.goalType === 'LOSE_WEIGHT' ? 'Perder Peso' : 
                   'Condicionamento'}
                </p>
                <p className="text-xs text-text-muted">Seu objetivo</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            {challenge.isCompleted ? (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-accent">Desafio Completado!</p>
                  <p className="text-sm text-accent">
                    Completado em {new Date(challenge.completedAt!).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-xl">
                <Target className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Desafio Pendente</p>
                  <p className="text-sm text-text-muted">
                    Complete este desafio para ganhar {challenge.challenge.points} pontos
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Goal Type Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-accent/10 to-yellow-300/10 text-accent border border-accent/30 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              {challenge.challenge.goalType === 'GAIN_MASS' ? 'Ganhar Massa' : 
               challenge.challenge.goalType === 'LOSE_WEIGHT' ? 'Perder Peso' : 
               'Melhorar Condicionamento'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-border/20">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 font-medium cursor-pointer"
            >
              {challenge.isCompleted ? 'Fechar' : 'Cancelar'}
            </button>
            
            {!challenge.isCompleted && !challenge.isAccepted && (
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Aceitando...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Aceitar Desafio
                  </>
                )}
              </button>
            )}

            {challenge.isAccepted && !challenge.isCompleted && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 disabled:from-accent/50 disabled:to-yellow-400/50 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Feito
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
