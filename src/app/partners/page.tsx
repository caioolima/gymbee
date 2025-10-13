'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { 
  Heart, 
  X, 
  Target, 
  Zap, 
  Users, 
  Calendar,
  Star
} from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { SimpleAuthGuard } from '@/components/SimpleAuthGuard';
import { useRouter } from 'next/navigation';
import { useUserMatching, useNewMatches, UserCard } from '@/hooks/useUserMatching';
import { StandardLayout } from '@/components/StandardLayout';
import { AvatarWithInitials } from '@/components/AvatarWithInitials';
import { MatchModal } from '@/components/MatchModal';
import { NewMatchesNotification } from '@/components/NewMatchesNotification';
import { MatchesList } from '@/components/MatchesList';

// Componente de Card com gestos de swipe
function SwipeableCard({ user, onSwipe, onLike, onSkip }: {
  user: UserCard;
  onSwipe: (direction: 'left' | 'right') => void;
  onLike: () => void;
  onSkip: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, -150, 0, 150, 200], [0.8, 0.9, 1, 0.9, 0.8]);

  const getGoalTypeLabel = (goalType?: string) => {
    switch (goalType) {
      case 'LOSE_WEIGHT': return 'Perder Peso';
      case 'GAIN_MASS': return 'Ganhar Massa';
      case 'IMPROVE_CONDITIONING': return 'Melhorar Condicionamento';
      default: return 'Não definido';
    }
  };

  const getExperienceLevelLabel = (level?: string) => {
    switch (level) {
      case 'BEGINNER': return 'Iniciante';
      case 'INTERMEDIATE': return 'Intermediário';
      case 'ADVANCED': return 'Avançado';
      default: return 'Não definido';
    }
  };

  const getCompatibilityColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, scale }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 150) {
          onSwipe('right');
          onLike();
        } else if (info.offset.x < -150) {
          onSwipe('left');
          onSkip();
        }
      }}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden h-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-bl-2xl"></div>
        
        {/* Floating Background Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-r from-accent/10 to-yellow-400/10 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-r from-yellow-400/10 to-accent/10 rounded-full blur-sm"
        />
        
        {/* Like/Skip Indicators */}
        <motion.div
          style={{
            opacity: useTransform(x, [0, 150], [0, 1]),
          }}
          className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg z-20"
        >
          LIKE
        </motion.div>
        
        <motion.div
          style={{
            opacity: useTransform(x, [-150, 0], [1, 0]),
          }}
          className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg z-20"
        >
          SKIP
        </motion.div>
        
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-accent">PARCEIRO DE TREINO</span>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            {user.compatibilityScore && (
              <div className="flex items-center gap-1" title="Compatibilidade baseada em objetivos, experiência e frequência de treino">
                <Star className="w-4 h-4 text-accent" />
                <span className={`text-sm font-medium ${getCompatibilityColor(user.compatibilityScore)}`}>
                  {Math.round(user.compatibilityScore * 100)}% compatível
                </span>
              </div>
            )}
          </div>

          {/* Profile Image Placeholder */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative mx-auto mb-6"
          >
            <AvatarWithInitials 
              name={user.fullName}
              size="xl"
              className="w-32 h-32 border-4 border-accent/30 shadow-xl"
            />
            
            {/* Pulse Ring */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 border-4 border-accent/40 rounded-full"
            />
            
            {/* Online Indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-card-bg rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">{user.fullName}</h2>
            <p className="text-text-muted">@{user.username}</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-sm text-text-muted">{user.age} anos</span>
              <span className="text-sm text-text-muted">•</span>
              <span className="text-sm text-text-muted">{user.gender === 'MALE' ? 'Masculino' : user.gender === 'FEMALE' ? 'Feminino' : 'Outro'}</span>
            </div>
          </div>

          {/* Goal and Experience */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-xs text-text-muted">Objetivo</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {getGoalTypeLabel(user.goalType)}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-xs text-text-muted">Experiência</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {getExperienceLevelLabel(user.experienceLevel)}
              </p>
            </div>
          </div>

          {/* Workout Frequency */}
          <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg p-3 mb-auto">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-xs text-text-muted">Frequência de Treino</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {user.workoutFrequency && user.workoutFrequency > 0 
                ? `${Math.round(user.workoutFrequency)} treinos por semana`
                : 'Sem treinos'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              className="flex-1 bg-transparent border-2 border-red-500/30 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-red-500/25"
            >
              <X className="w-6 h-6" />
              <span>Pular</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className="flex-1 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl cursor-pointer relative overflow-hidden"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="w-6 h-6" />
              </motion.div>
              <span>Curtir</span>
              
              {/* Shine Effect */}
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PartnersPage() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserCard | null>(null);
  const [matchesListOpen, setMatchesListOpen] = useState(false);

  const { users, isLoading, error, swipeUser, isSwiping, refetch } = useUserMatching();
  const { matches, hasNewMatches, clearNewMatches } = useNewMatches();

  // Reset currentUserIndex se estiver fora dos limites
  useEffect(() => {
    if (users && currentUserIndex >= users.length) {
      setCurrentUserIndex(0);
    }
  }, [users, currentUserIndex]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!users || currentUserIndex >= users.length || isAnimating) return;

    const currentUser = users[currentUserIndex];
    setIsAnimating(true);
    
    try {
      const result = await swipeUser({
        swipedUserId: currentUser.id,
        action: direction === 'right' ? 'LIKE' : 'SKIP',
      });
      
      // Se foi um match, mostrar modal
      if (result?.isMatch && direction === 'right') {
        setMatchedUser(currentUser);
        setMatchModalOpen(true);
      }
      
      setTimeout(() => {
        setCurrentUserIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } catch (error) {
      console.error('Erro ao fazer swipe:', error);
      setIsAnimating(false);
    }
  };

  const handleLike = () => {
    handleSwipe('right');
  };

  const handleSkip = () => {
    handleSwipe('left');
  };

  if (isLoading) {
    return (
      <StandardLayout title="Encontrar Parceiros" subtitle="Encontre seu parceiro de treino ideal">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Encontrar Parceiros" subtitle="Erro ao carregar">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar usuários</h2>
          <p className="text-text-muted">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </StandardLayout>
    );
  }

  const currentUser = users?.[currentUserIndex];
  const hasMoreUsers = users && currentUserIndex < users.length;

  return (
    <SimpleAuthGuard>
      <StandardLayout title="Encontrar Parceiros" subtitle="Encontre seu parceiro de treino ideal">
      
      {/* Header com botão de matches */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <button
          onClick={() => setMatchesListOpen(true)}
          className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 cursor-pointer flex items-center gap-2 font-semibold shadow-lg"
        >
          <Heart className="w-4 h-4 fill-current" />
          Matches
          {matches && matches.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-black text-xs rounded-full flex items-center justify-center font-bold">
              {matches.length}
            </span>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 pt-8"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Users className="w-10 h-10 text-black" />
          </motion.div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"
          />
        </div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent mb-2"
        >
          Encontre Seu Parceiro Ideal
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-text-muted text-lg"
        >
          Conecte-se com pessoas que compartilham seus objetivos de fitness
        </motion.p>
      </motion.div>

      {/* Main Content */}
      {!hasMoreUsers ? (
        <div className="text-center py-20 pt-32">
          <div className="w-24 h-24 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum parceiro disponível</h3>
          <p className="text-text-muted mb-4">
            Volte mais tarde para encontrar novos parceiros de treino!
          </p>
          <button
            onClick={async () => {
              setCurrentUserIndex(0);
              await refetch();
            }}
            className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-semibold rounded-lg hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer"
          >
            Recarregar
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto pt-4"
        >
          {/* Card Stack */}
          <div className="relative h-[600px]">
            <AnimatePresence>
              {users?.slice(currentUserIndex, currentUserIndex + 2).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8, 
                    y: 50,
                    rotateY: index === 0 ? 0 : 10,
                    zIndex: index === 0 ? 10 : 5
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    rotateY: index === 0 ? 0 : 10,
                    zIndex: index === 0 ? 10 : 5
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8, 
                    x: index === 0 ? 300 : 0,
                    rotate: index === 0 ? 30 : 0,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="absolute inset-0"
                  style={{
                    transform: index === 1 ? 'translateY(20px) scale(0.95)' : undefined,
                  }}
                >
                  <SwipeableCard
                    user={user}
                    onSwipe={handleSwipe}
                    onLike={handleLike}
                    onSkip={handleSkip}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>


          {/* Swipe Instructions */}
          <div className="mt-4 text-center">
            <p className="text-xs text-text-muted">
              Deslize para a direita para curtir • Deslize para a esquerda para pular
            </p>
          </div>
        </motion.div>
      )}
    </StandardLayout>

    {/* Match Modal */}
    <MatchModal
      isOpen={matchModalOpen}
      onClose={() => setMatchModalOpen(false)}
      onViewProfile={(user) => {
        setMatchModalOpen(false);
        router.push(`/profile/user/${user.username}`);
      }}
      matchedUser={matchedUser}
    />

    {/* New Matches Notification */}
    <NewMatchesNotification
      isVisible={hasNewMatches}
      onClose={clearNewMatches}
      onViewMatches={() => {
        clearNewMatches();
        setMatchesListOpen(true);
      }}
      newMatchesCount={matches?.length || 0}
    />

    {/* Matches List Modal */}
    <MatchesList
      matches={matches || []}
      isOpen={matchesListOpen}
      onClose={() => setMatchesListOpen(false)}
      onViewProfile={(user) => {
        setMatchesListOpen(false);
        router.push(`/profile/user/${user.username}`);
      }}
    />
    </SimpleAuthGuard>
  );
}
