'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Calendar, CheckCircle, Clock, Zap, Dumbbell } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievementsQuery';
import { Achievement } from '@/types/achievements';

interface AchievementsListProps {
  onClose: () => void;
}

export function AchievementsList({ onClose }: AchievementsListProps) {
  const { 
    achievements, 
    isLoading, 
    error, 
    markAchievementAsRead, 
    getUnreadCount 
  } = useAchievements();

  const unreadCount = getUnreadCount();

  const getAchievementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'welcome_to_hive':
        return <Dumbbell className="w-6 h-6 text-black" />;
      case 'first_goal':
        return <Trophy className="w-6 h-6" />;
      case 'weight_loss':
        return <Star className="w-6 h-6" />;
      case 'workout_streak':
        return <Calendar className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'welcome_to_hive':
        return 'from-accent to-yellow-300';
      case 'first_goal':
        return 'from-yellow-500 to-yellow-600';
      case 'weight_loss':
        return 'from-accent to-yellow-400';
      case 'workout_streak':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card-bg rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Carregando conquistas...
            </h3>
            <p className="text-text-muted">
              Buscando suas conquistas mais recentes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card-bg rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Erro ao carregar conquistas
            </h3>
            <p className="text-text-muted mb-4">
              {error?.message || 'Erro desconhecido'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card-bg rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Suas Conquistas
                </h2>
                <p className="text-text-muted text-sm">
                  {achievements.length} conquistas desbloqueadas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <div className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  {unreadCount} novas
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Nenhuma conquista ainda
              </h3>
              <p className="text-text-muted">
                Continue treinando para desbloquear suas primeiras conquistas!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement: Achievement, index: number) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    achievement.isRead 
                      ? 'bg-card-bg/50 border-border/30' 
                      : 'bg-gradient-to-r from-accent/10 to-yellow-300/10 border-accent/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAchievementColor(achievement.type)} rounded-xl flex items-center justify-center text-white`}>
                      {getAchievementIcon(achievement.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">
                          {achievement.title}
                        </h3>
                        {!achievement.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-text-muted text-sm mb-2">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(achievement.unlockedAt)}
                        </div>
                        
                        {achievement.isRead ? (
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle className="w-3 h-3" />
                            Lida
                          </div>
                        ) : (
                          <button
                            onClick={() => markAchievementAsRead(achievement.id)}
                            className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors cursor-pointer"
                          >
                            <Clock className="w-3 h-3" />
                            Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
