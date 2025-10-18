'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { useUserLevel } from '@/hooks/useUserLevelQuery';

export function UserLevelCard() {
  const { levelInfo, isLoading, error } = useUserLevel();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-6"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-muted rounded w-full"></div>
        </div>
      </motion.div>
    );
  }

  if (error || !levelInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-6"
      >
        <div className="flex items-center justify-center h-32">
          <p className="text-text-muted">Erro ao carregar nível</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-bl-2xl"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Seu Nível</h3>
              <p className="text-sm text-text-muted">Continue evoluindo!</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-accent">Nível {levelInfo.level}</span>
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <Zap className="w-4 h-4" />
              <span>{levelInfo.totalXp} XP</span>
            </div>
          </div>
          
          <div className="text-sm text-text-muted mb-3">
            {isNaN(levelInfo.xpToNextLevel) ? 'Calculando...' : `${levelInfo.xpToNextLevel} XP para o próximo nível`}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-accent to-yellow-400 h-2 rounded-full"
            />
          </div>
          
          <div className="flex justify-between text-xs text-text-muted">
            <span>{levelInfo.currentLevelXp} XP</span>
            <span>{levelInfo.progressPercentage}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-muted">
          <TrendingUp className="w-4 h-4" />
          <span>Complete treinos e desafios para ganhar XP!</span>
        </div>
      </div>
    </motion.div>
  );
}

