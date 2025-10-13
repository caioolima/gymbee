'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Star, 
  Target, 
  Calendar, 
  MapPin,
  Zap,
  Trophy,
  Users,
  Plus,
  Phone,
  CheckCircle,
  Users2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { SimpleAuthGuard } from '@/components/SimpleAuthGuard';
import { AvatarWithInitials } from '@/components/AvatarWithInitials';
import { StandardLayout } from '@/components/StandardLayout';
import { WorkoutInviteModal } from '@/components/WorkoutInviteModal';

interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  level: number;
  experiencePoints: number;
  goals?: Array<{
    goalType: string;
    experienceLevel: string;
    currentWeight: number;
    targetWeight: number;
    isActive: boolean;
  }>;
  achievements?: Array<{
    type: string;
    name: string;
    description: string;
    createdAt: string;
  }>;
  isMatch?: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, token } = useSimpleAuth();
  const username = params.username as string;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [hasPendingInvite, setHasPendingInvite] = useState(false);
  const [isCheckingInvites, setIsCheckingInvites] = useState(true);

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => apiService.getUserProfileByUsername(username, token!),
    enabled: !!token && !!username,
  });

  // Buscar matches para verificar se é um match
  const { data: matches } = useQuery({
    queryKey: ['user-matches'],
    queryFn: () => apiService.getUserMatches(token!),
    enabled: !!token,
  });

  // Verificar se já existe convite pendente para este usuário
  useEffect(() => {
    const checkPendingInvites = async () => {
      if (!token || !userProfile) return;
      
      setIsCheckingInvites(true);
      try {
        const sentInvites = await apiService.getSentWorkoutInvites(token);
        const pendingInvite = sentInvites.find(invite => 
          invite.inviteeId === userProfile.id && 
          (invite.status === 'PENDING' || invite.status === 'MODIFIED')
        );
        setHasPendingInvite(!!pendingInvite);
      } catch (error) {
        console.error('Erro ao verificar convites:', error);
      } finally {
        setIsCheckingInvites(false);
      }
    };

    checkPendingInvites();
  }, [token, userProfile]);

  // Verificar se é um match
  const isMatch = matches?.some(match => match.partner.username === username);

  const getGoalTypeLabel = (goalType: string) => {
    switch (goalType) {
      case 'LOSE_WEIGHT': return 'Perder Peso';
      case 'GAIN_MASS': return 'Ganhar Massa';
      case 'IMPROVE_CONDITIONING': return 'Melhorar Condicionamento';
      default: return goalType;
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Iniciante';
      case 'INTERMEDIATE': return 'Intermediário';
      case 'ADVANCED': return 'Avançado';
      default: return level;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M': return 'Masculino';
      case 'F': return 'Feminino';
      default: return gender;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <SimpleAuthGuard>
        <StandardLayout title="Perfil" subtitle="Carregando perfil do usuário">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
          </div>
        </StandardLayout>
      </SimpleAuthGuard>
    );
  }

  if (error || !userProfile) {
    return (
      <SimpleAuthGuard>
        <StandardLayout title="Perfil" subtitle="Erro ao carregar">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Usuário não encontrado
            </h3>
            <p className="text-text-muted mb-4">
              O perfil que você está procurando não existe ou não está disponível.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-semibold rounded-xl hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </StandardLayout>
      </SimpleAuthGuard>
    );
  }

  const activeGoal = userProfile.goals?.find(goal => goal.isActive);
  const memberSince = formatDate(userProfile.createdAt);
  const age = calculateAge(userProfile.birthDate);

  return (
    <SimpleAuthGuard>
      <StandardLayout title="Perfil" subtitle={`Perfil de ${userProfile.fullName}`}>
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
            <p className="text-text-muted">Perfil de {userProfile.fullName}</p>
          </div>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-card-bg/50 to-card-bg/30 rounded-3xl p-8 mb-6 border border-border/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <AvatarWithInitials 
                name={userProfile.fullName} 
                size="w-32 h-32" 
                className={`ring-4 ${isMatch ? 'ring-green-500/50' : 'ring-accent/30'}`}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">{userProfile.level}</span>
              </div>
              {isMatch && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-foreground">
                  {userProfile.fullName}
                </h2>
                {isMatch && (
                  <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    Match
                  </div>
                )}
              </div>
              <p className="text-text-muted mb-4">@{userProfile.username}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-card-bg/50 p-3 rounded-xl">
                  <div className="text-text-muted mb-1">Idade</div>
                  <div className="font-semibold text-foreground">{age} anos</div>
                </div>
                <div className="bg-card-bg/50 p-3 rounded-xl">
                  <div className="text-text-muted mb-1">Gênero</div>
                  <div className="font-semibold text-foreground">{getGenderLabel(userProfile.gender)}</div>
                </div>
                <div className="bg-card-bg/50 p-3 rounded-xl">
                  <div className="text-text-muted mb-1">Membro desde</div>
                  <div className="font-semibold text-foreground">{memberSince}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {isMatch ? (
                <>
                  <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-black" />
                    Vocês já se curtiram!
                  </div>
                  
                  {isCheckingInvites ? (
                    <div className="px-6 py-3 bg-muted/50 text-text-muted font-semibold rounded-xl flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin"></div>
                      Verificando...
                    </div>
                  ) : hasPendingInvite ? (
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Convite Enviado
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-semibold rounded-xl hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Convidar para Treino
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      const phone = userProfile.phone?.replace(/\D/g, '') || '11999999999';
                      const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`;
                      const message = `Oi ${userProfile.fullName}! Vi seu perfil no GymBee e gostaria de treinar junto!`;
                      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </button>
                </>
              ) : (
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Curtir
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-accent/10 to-yellow-400/10 rounded-2xl p-6 border border-accent/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Nível {userProfile.level}</h3>
                <p className="text-sm text-text-muted">{userProfile.experiencePoints} XP</p>
              </div>
            </div>
          </motion.div>

          {/* Goal Card */}
          {activeGoal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{getGoalTypeLabel(activeGoal.goalType)}</h3>
                  <p className="text-sm text-text-muted">{getExperienceLevelLabel(activeGoal.experienceLevel)}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{userProfile.achievements?.length || 0}</h3>
                <p className="text-sm text-text-muted">Conquistas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals Section */}
        {activeGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card-bg/30 rounded-2xl p-6 border border-border/20 mb-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Objetivo Ativo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-muted mb-1">Objetivo</p>
                <p className="font-semibold text-foreground">{getGoalTypeLabel(activeGoal.goalType)}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Nível de Experiência</p>
                <p className="font-semibold text-foreground">{getExperienceLevelLabel(activeGoal.experienceLevel)}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Peso Atual</p>
                <p className="font-semibold text-foreground">{activeGoal.currentWeight} kg</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Peso Meta</p>
                <p className="font-semibold text-foreground">{activeGoal.targetWeight} kg</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements Section */}
        {userProfile.achievements && userProfile.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card-bg/30 rounded-2xl p-6 border border-border/20"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Conquistas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.achievements.map((achievement, index) => (
                <div key={index} className="bg-card-bg/50 p-4 rounded-xl">
                  <h4 className="font-semibold text-foreground mb-1">{achievement.name}</h4>
                  <p className="text-sm text-text-muted mb-2">{achievement.description}</p>
                  <p className="text-xs text-text-muted">
                    {formatDate(achievement.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workout Invite Modal */}
        {userProfile && (
          <WorkoutInviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onSendInvite={async (inviteData) => {
              try {
                await apiService.createWorkoutInvite(inviteData, token!);
                // TODO: Adicionar toast de sucesso
                console.log('Convite enviado com sucesso!');
              } catch (error) {
                console.error('Erro ao enviar convite:', error);
                // TODO: Adicionar toast de erro
              }
            }}
            invitedUser={{
              id: userProfile.id,
              fullName: userProfile.fullName,
              username: userProfile.username,
            }}
          />
        )}
      </StandardLayout>
    </SimpleAuthGuard>
  );
}
