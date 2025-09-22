'use client';

import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, Activity, Trophy, Loader2, Calendar, Zap, Target, Star, CheckCircle, Clock, Flame, Award, Eye, ArrowUpRight, Sparkles, BarChart3, Timer } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStatsQuery';
import { useAchievements } from '@/hooks/useAchievementsQuery';
import { useDailyChallenges } from '@/hooks/useDailyChallengesQuery';
import { useState, useEffect } from 'react';
import { AchievementsList } from './AchievementsList';
import { DailyChallengeDialog } from './DailyChallengeDialog';

interface DashboardStatsProps {
  user: any;
}

export function DashboardStats({ user }: DashboardStatsProps) {
  const { stats, isLoading, error } = useDashboardStats();
  const { achievementCount, getUnreadCount } = useAchievements();
  const { todaysChallenge, acceptDailyChallenge, completeDailyChallenge, isAccepting, isCompleting } = useDailyChallenges();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (!isLoading && !error) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.6, ease: "easeInOut" }
      });
    }
  }, [isLoading, error, controls]);

  // Funções de tradução
  const translateCategory = (category: string) => {
    const translations: { [key: string]: string } = {
      'STRENGTH': 'Força',
      'CARDIO': 'Cardio',
      'FLEXIBILITY': 'Flexibilidade',
      'GENERAL': 'Geral',
      'TREINO': 'Treino',
      'PROGRESSO': 'Progresso',
      'META': 'Meta',
      'HIIT': 'HIIT',
      'NUTRITION': 'Nutrição',
      'WEIGHT_LOSS': 'Perda de Peso',
      'MASS_GAIN': 'Ganho de Massa'
    };
    return translations[category] || category;
  };

  const translateDifficulty = (difficulty: string) => {
    const translations: { [key: string]: string } = {
      'EASY': 'Fácil',
      'MEDIUM': 'Médio',
      'HARD': 'Difícil'
    };
    return translations[difficulty] || difficulty;
  };

  const translateGoalType = (goalType: string) => {
    const translations: { [key: string]: string } = {
      'GAIN_MASS': 'Ganho de Massa',
      'LOSE_WEIGHT': 'Perda de Peso',
      'MAINTAIN': 'Manter Peso'
    };
    return translations[goalType] || goalType;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-yellow-400/5 to-amber-500/5 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-700/50 rounded-lg animate-pulse" />
                  <div className="h-12 w-16 bg-slate-600/50 rounded-xl animate-pulse" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-700/30 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-700/30 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative overflow-hidden bg-gradient-to-br from-slate-900/20 via-slate-800/10 to-slate-900/20 backdrop-blur-xl rounded-2xl p-8 border border-slate-500/30 shadow-2xl"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-yellow-400/5 to-amber-500/5 animate-pulse" />
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500 bg-clip-text text-transparent mb-3">
            Ops! Algo deu errado
          </h3>
          
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {error?.message || 'Não foi possível carregar suas estatísticas. Tente novamente.'}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent/25 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            Tentar Novamente
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const handleViewChallenge = () => {
    setShowDailyChallenge(true);
  };

  const statsData = [
    {
      title: 'Desafio Diário',
      value: todaysChallenge ? todaysChallenge.challenge.title : 'Nenhum',
      icon: Target,
      gradient: 'from-accent via-yellow-400 to-amber-500',
      bgGradient: 'from-accent/10 via-yellow-400/5 to-amber-500/10',
      shadowColor: 'shadow-accent/20',
      glowColor: 'shadow-accent/30',
      subtitle: todaysChallenge ? (todaysChallenge.isCompleted ? 'Completado hoje' : 'Pendente') : 'Sem desafio ativo',
      subtitleIcon: todaysChallenge ? (todaysChallenge.isCompleted ? CheckCircle : Clock) : null,
      description: todaysChallenge ? 'Mantenha sua consistência diária!' : 'Complete treinos para desbloquear',
      details: todaysChallenge ? [
        `${translateCategory(todaysChallenge.challenge.category || 'GENERAL')} • ${translateDifficulty(todaysChallenge.challenge.difficulty || 'MEDIUM')}`,
        `${todaysChallenge.challenge.points || 10} pontos de recompensa`
      ] : [
        'Complete 3 treinos para desbloquear',
        'Desafios renovam diariamente'
      ],
      badge: todaysChallenge ? 'Visualizar' : null,
      badgeIcon: Eye,
      onClick: todaysChallenge ? handleViewChallenge : undefined,
      trend: todaysChallenge ? 'up' : 'neutral',
    },
    {
      title: 'Progresso Semanal',
      value: `${stats.weeklyWorkouts}/${stats.weeklyGoal}`,
      icon: BarChart3,
      gradient: 'from-slate-600 via-slate-500 to-slate-400',
      bgGradient: 'from-slate-600/10 via-slate-500/5 to-slate-400/10',
      shadowColor: 'shadow-slate-500/20',
      glowColor: 'shadow-slate-500/30',
      subtitle: `${Math.round((stats.weeklyWorkouts / stats.weeklyGoal) * 100)}% da meta semanal`,
      subtitleIcon: TrendingUp,
      description: `${stats.totalWorkouts} treinos realizados no total`,
      details: [
        `Meta semanal: ${stats.weeklyGoal} treinos`,
        `Restam: ${Math.max(0, stats.weeklyGoal - stats.weeklyWorkouts)} treinos`
      ],
      trend: stats.weeklyWorkouts > 0 ? 'up' : 'neutral',
      progress: (stats.weeklyWorkouts / stats.weeklyGoal) * 100,
    },
    {
      title: 'Sequência Atual',
      value: `${stats.currentStreak} dias`,
      icon: Zap,
      gradient: 'from-orange-500 via-amber-500 to-accent',
      bgGradient: 'from-orange-500/10 via-amber-500/5 to-accent/10',
      shadowColor: 'shadow-orange-500/20',
      glowColor: 'shadow-orange-500/30',
      subtitle: stats.currentStreak > 0 ? 'Em chamas!' : 'Comece hoje',
      subtitleIcon: stats.currentStreak > 0 ? Flame : Clock,
      description: `Melhor sequência: ${stats.bestStreak} dias`,
      details: stats.currentStreak > 0 ? [
        `Iniciada há ${stats.currentStreak} dias`,
        `Próximo marco: ${Math.ceil(stats.currentStreak / 7) * 7} dias`
      ] : [
        'Treine hoje para iniciar',
        'Sequências aumentam motivação'
      ],
      trend: stats.currentStreak > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Conquistas',
      value: achievementCount.toString(),
      icon: Trophy,
      gradient: 'from-amber-600 via-accent to-yellow-300',
      bgGradient: 'from-amber-600/10 via-accent/5 to-yellow-300/10',
      shadowColor: 'shadow-amber-500/20',
      glowColor: 'shadow-amber-500/30',
      subtitle: getUnreadCount() > 0 ? `${getUnreadCount()} nova(s)` : 'Todas visualizadas',
      subtitleIcon: getUnreadCount() > 0 ? Award : CheckCircle,
      description: 'Medalhas conquistadas',
      details: [
        `Total: ${achievementCount} conquistas`,
        getUnreadCount() > 0 ? `${getUnreadCount()} aguardando visualização` : 'Todas visualizadas'
      ],
      badge: 'Ver Conquistas',
      badgeIcon: Trophy,
      onClick: () => setShowAchievements(true),
      unreadCount: getUnreadCount(),
      trend: achievementCount > 0 ? 'up' : 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
              y: -12, 
              scale: 1.03,
              transition: { 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:${stat.shadowColor} transition-all duration-500 ${
              stat.onClick ? 'cursor-pointer' : ''
            }`}
            onClick={stat.onClick}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl ${stat.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                    {stat.trend === 'up' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          delay: 0.5 + index * 0.1,
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 bg-accent rounded-full"
                      />
                    )}
                  </div>
                  
                  <motion.p 
                    className="text-5xl font-bold bg-gradient-to-r from-white via-slate-50 to-white bg-clip-text text-transparent leading-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                
                <motion.div 
                  className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative shadow-lg`}
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    scale: 1.1
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                  {stat.unreadCount && stat.unreadCount > 0 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {stat.unreadCount}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Progress bar for weekly progress */}
              {stat.progress !== undefined && (
                <div className="mb-4">
                  <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden relative">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${stat.gradient} rounded-full relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.5 + index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 1.5 + index * 0.1,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Status */}
              {stat.subtitle && (
                <motion.div 
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {stat.subtitleIcon && (
                    <stat.subtitleIcon className="w-4 h-4 text-slate-300" />
                  )}
                  <p className="text-sm font-semibold text-slate-300">{stat.subtitle}</p>
                </motion.div>
              )}

              {/* Description */}
              {stat.description && (
                <motion.p 
                  className="text-sm text-slate-300 mb-3 leading-relaxed font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.description}
                </motion.p>
              )}

              {/* Details - Simplified format */}
              {stat.details && stat.details.length > 0 && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {stat.details.slice(0, 2).join(' • ')}
                  </p>
                </motion.div>
              )}

              {/* Action button */}
              {stat.badge && (
                <motion.div 
                  className="flex items-center justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${stat.gradient} text-black text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer`}
                  >
                    {/* Button shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    {stat.badgeIcon && <stat.badgeIcon className="w-4 h-4" />}
                    {stat.badge}
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Modal de Conquistas */}
      {showAchievements && (
        <AchievementsList onClose={() => setShowAchievements(false)} />
      )}
      
      {/* Modal de Desafio Diário */}
      {showDailyChallenge && todaysChallenge && (
        <DailyChallengeDialog 
          challenge={todaysChallenge}
          onClose={() => setShowDailyChallenge(false)}
          onAccept={acceptDailyChallenge}
          onComplete={completeDailyChallenge}
          isAccepting={isAccepting}
          isCompleting={isCompleting}
        />
      )}
    </div>
  );
}
