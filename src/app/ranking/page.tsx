'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ThumbsUp, Users, TrendingUp, Star, Award, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRanking } from '@/hooks/useUserRankingQuery';
import { StandardLayout } from '@/components/StandardLayout';
import { AvatarWithInitials } from '@/components/AvatarWithInitials';

export default function RankingPage() {
  const { user, token } = useAuth();
  const { ranking, isLoading, error } = useUserRanking();

  // Redirect if not authenticated
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h2>
          <p className="text-text-muted">Você precisa estar logado para acessar esta página</p>
        </div>
      </div>
    );
  }

  const handleViewProfile = (userId: string) => {
    // Implementar navegação para perfil do usuário
    console.log('Ver perfil do usuário:', userId);
  };

  if (isLoading) {
    return (
      <StandardLayout title="Ranking" subtitle="Top usuários em desafios diários">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Ranking" subtitle="Erro ao carregar">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar ranking</h2>
          <p className="text-text-muted">{error}</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Ranking" subtitle="Veja os melhores treinos">

        {/* Top 3 Podium */}
        {ranking && ranking.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Top 3</h2>
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center w-48"
              >
                <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-600">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{ranking[1].fullName}</h3>
                <p className="text-sm text-gray-600 mb-3">@{ranking[1].username}</p>
                <div className="flex items-center justify-center text-accent font-semibold">
                  <Trophy className="w-5 h-5 mr-1" />
                  {ranking[1].totalPoints} pontos
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-2xl p-6 text-center w-48 transform scale-110"
              >
                <div className="bg-yellow-300 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="font-bold text-white mb-2">{ranking[0].fullName}</h3>
                <p className="text-sm text-yellow-100 mb-3">@{ranking[0].username}</p>
                <div className="flex items-center justify-center text-white font-semibold">
                  <Star className="w-5 h-5 mr-1" />
                  {ranking[0].totalPoints} pontos
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center w-48"
              >
                <div className="bg-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{ranking[2].fullName}</h3>
                <p className="text-sm text-gray-600 mb-3">@{ranking[2].username}</p>
                <div className="flex items-center justify-center text-orange-500 font-semibold">
                  <Award className="w-5 h-5 mr-1" />
                  {ranking[2].totalPoints} pontos
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Full Ranking List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Ranking Completo</h2>
            <p className="text-gray-600">Top usuários em desafios diários</p>
          </div>

          <div className="divide-y divide-gray-200">
            {ranking?.map((user: any, index: number) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <div className="relative">
                          <AvatarWithInitials 
                            name={user.fullName}
                            size="lg"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <span className="text-xs">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <AvatarWithInitials 
                            name={user.fullName}
                            size="lg"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-background font-bold text-xs">{index + 1}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-gray-600 text-sm">@{user.username}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {user.totalPoints} pontos
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {user.completedChallenges} desafios
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewProfile(user.id)}
                    className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-white"
                  >
                    <Users className="w-5 h-5 mr-2 inline" />
                    Ver Perfil
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {ranking?.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum usuário no ranking</h3>
            <p className="text-gray-600">Complete desafios diários para aparecer no ranking!</p>
          </div>
        )}
      </StandardLayout>
    );
  }
