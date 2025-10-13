'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, Clock, Eye, ArrowUpRight, Trophy, Zap, Sparkles, Bot, Brain } from 'lucide-react';
import { useDailyChallenges } from '@/hooks/useDailyChallengesQuery';

interface DailyChallengeCardProps {
  user: any;
  onViewChallenge: () => void;
}

export function DailyChallengeCard({ user, onViewChallenge }: DailyChallengeCardProps) {
  const { todaysChallenge, isLoading } = useDailyChallenges();

  const translateCategory = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'CARDIO': return 'Cardio';
      case 'MUSCULAÇÃO': return 'Musculação';
      case 'FUNCIONAL': return 'Funcional';
      case 'FLEXIBILIDADE': return 'Flexibilidade';
      case 'NUTRIÇÃO': return 'Nutrição';
      case 'HIDRATAÇÃO': return 'Hidratação';
      case 'RECUPERAÇÃO': return 'Recuperação';
      default: return 'Geral';
    }
  };

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Médio';
      case 'HARD': return 'Difícil';
      default: return 'Médio';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HARD': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex items-center justify-center h-48">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!todaysChallenge) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 p-6 flex flex-col justify-center items-center text-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Sem Desafio Ativo</h3>
          <p className="text-text-muted text-sm mb-4">Complete treinos para desbloquear desafios diários</p>
          <div className="text-xs text-text-muted">
            <p>• Complete 3 treinos para desbloquear</p>
            <p>• Desafios renovam diariamente</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
      
      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="flex items-center gap-1 bg-gradient-to-r from-accent/20 to-yellow-400/20 border border-accent/30 rounded-full px-3 py-1">
          <Bot className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium text-accent">IA</span>
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute top-16 right-4 w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-2xl flex items-center justify-center opacity-60">
        <Target className="w-8 h-8 text-accent" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-accent">DESAFIO DIÁRIO</span>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>

        {/* Challenge Title */}
        <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight">
          {todaysChallenge.challenge.title}
        </h3>

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          {todaysChallenge.isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Completado hoje</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Pendente</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-text-muted text-sm mb-4 leading-relaxed">
          {todaysChallenge.challenge.description}
        </p>

        {/* AI Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg p-3 mb-4 w-fit max-w-sm"
        >
          <div className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">
                {todaysChallenge.isCompleted 
                  ? 'Desafio completado com sucesso!' 
                  : 'Desafio criado especialmente para você'
                }
              </p>
              <p className="text-xs text-text-muted">
                {todaysChallenge.isCompleted 
                  ? 'Nossa IA analisou seu perfil e criou este desafio personalizado. Parabéns!' 
                  : 'Baseado no seu objetivo e nível de experiência atual.'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Challenge Details */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center">
              <Trophy className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {todaysChallenge.challenge.points} pontos
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-muted">
              {translateCategory(todaysChallenge.challenge.category)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${getDifficultyColor(todaysChallenge.challenge.difficulty)}`}>
              {translateDifficulty(todaysChallenge.challenge.difficulty)}
            </span>
          </div>
        </div>

        {/* Completion Info and Action Button */}
        <div className="flex items-center gap-3">
          {todaysChallenge.isCompleted && (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Desafio Concluído!</span>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewChallenge}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
              todaysChallenge.isCompleted 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30' 
                : 'bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black shadow-lg hover:shadow-xl'
            }`}
          >
            {todaysChallenge.isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Ver Desafio</span>
                <Sparkles className="w-3 h-3 animate-pulse" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
