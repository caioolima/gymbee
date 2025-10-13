'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users, TrendingUp, Crown } from 'lucide-react';
import { useUserRanking } from '@/hooks/useUserRankingQuery';

interface UserRankingProps {
  user: any;
}

export function UserRanking({ user }: UserRankingProps) {
  const { ranking, isLoading, error } = useUserRanking();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return Crown;
      case 2:
        return Trophy;
      case 3:
        return Medal;
      default:
        return Award;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-text-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex items-center justify-center h-48">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Ranking de Usuários</h3>
          <p className="text-text-muted">Erro ao carregar ranking</p>
        </div>
      </div>
    );
  }

  if (!ranking || ranking.length === 0) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Ranking de Usuários</h3>
          <p className="text-text-muted">Nenhum usuário encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Ranking de Usuários</h3>
            <p className="text-sm text-text-muted">Top performers em desafios diários</p>
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-3">
          {ranking.slice(0, 5).map((user: any, index: number) => {
            const position = user.position;
            const RankIcon = getRankIcon(position);
            const rankColor = getRankColor(position);
            const isCurrentUser = user.id === user?.id;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isCurrentUser 
                    ? 'bg-accent/10 border border-accent/30' 
                    : 'bg-card-bg/50 border border-border/30 hover:bg-card-bg/80'
                }`}
              >
                {/* Position */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card-bg/80 border border-border/30">
                  <RankIcon className={`w-4 h-4 ${rankColor}`} />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">
                      {user.fullName}
                    </h4>
                    {isCurrentUser && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                        Você
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted">
                    @{user.username}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="font-bold text-foreground">
                      {user.totalPoints}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {user.completedChallenges} desafios
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-card-bg/50 hover:bg-card-bg/80 border border-border/30 hover:border-accent/30 text-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Ver Ranking Completo</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

