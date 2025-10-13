'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Camera, 
  MapPin, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award, 
  Settings,
  Mail,
  Phone,
  Globe,
  Star,
  Activity,
  Zap,
  Trophy,
  Users,
  Heart,
  Loader2,
  Clock,
  Dumbbell,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useProfileData, useUpdateProfile } from '@/hooks/useProfileQuery';
import { useUserLevel } from '@/hooks/useUserLevelQuery';
import { StandardLayout } from '@/components/StandardLayout';
import { toast } from 'sonner';

// Funções auxiliares para tipos de treino
const getWorkoutTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'strength':
    case 'força':
      return 'from-red-500 to-red-600';
    case 'cardio':
      return 'from-blue-500 to-blue-600';
    case 'flexibility':
    case 'flexibilidade':
      return 'from-green-500 to-green-600';
    case 'endurance':
    case 'resistência':
      return 'from-purple-500 to-purple-600';
    case 'hiit':
      return 'from-orange-500 to-orange-600';
    case 'yoga':
      return 'from-pink-500 to-pink-600';
    case 'pilates':
      return 'from-indigo-500 to-indigo-600';
    case 'crossfit':
      return 'from-gray-600 to-gray-800';
    default:
      return 'from-accent to-yellow-400';
  }
};

const getWorkoutTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'strength':
    case 'força':
      return Dumbbell;
    case 'cardio':
      return Activity;
    case 'flexibility':
    case 'flexibilidade':
      return Heart;
    case 'endurance':
    case 'resistência':
      return TrendingUp;
    case 'hiit':
      return Zap;
    case 'yoga':
      return Heart;
    case 'pilates':
      return Activity;
    case 'crossfit':
      return Dumbbell;
    default:
      return Dumbbell;
  }
};

// Componente de Avatar com Iniciais
const AvatarWithInitials = ({ name, size = 'w-36 h-36', className = '' }: { name: string, size?: string, className?: string }) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${size} bg-gradient-to-br from-accent to-yellow-300 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20 relative group ${className}`}>
      <span className="text-black font-bold text-4xl tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>
        {initials}
      </span>
      
      {/* Overlay com efeito hover */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Camera className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  const { isAuthenticated } = useSimpleAuth();
  
  // Se não está autenticado, redirecionar imediatamente
  if (isAuthenticated === false) {
    window.location.href = '/login';
    return null;
  }

  const [activeTab, setActiveTab] = useState('overview');
  const [workoutFilter, setWorkoutFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    email: '',
    birthDate: '',
    gender: '',
    phone: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({
    fullName: '',
    username: '',
    email: '',
    birthDate: '',
    gender: '',
    phone: ''
  });
  const { currentUser, goals, achievements, stats, workouts, isLoading, isError } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { levelInfo } = useUserLevel();

  // Função para abrir modal de edição
  const handleEditProfile = () => {
    if (currentUser.data) {
      const formData = {
        fullName: currentUser.data.fullName || '',
        username: currentUser.data.username || '',
        email: currentUser.data.email || '',
        birthDate: currentUser.data.birthDate ? new Date(currentUser.data.birthDate).toISOString().split('T')[0] : '',
        gender: currentUser.data.gender || '',
        phone: '' // Campo não está no backend ainda
      };
      setEditForm(formData);
      setOriginalData(formData);
      setHasChanges(false);
    }
    setIsEditModalOpen(true);
  };

  // Função para detectar mudanças
  const handleInputChange = (field: string, value: string) => {
    const newForm = { ...editForm, [field]: value };
    setEditForm(newForm);
    
    // Verificar se há mudanças
    const hasChangesNow = Object.keys(newForm).some(key => {
      let newValue = newForm[key as keyof typeof newForm];
      const originalValue = originalData[key as keyof typeof originalData];
      
      // Não precisa mais tratar "Selecione" pois agora é apenas placeholder
      
      return newValue !== originalValue;
    });
    setHasChanges(hasChangesNow);
  };

  // Função para salvar alterações
  const handleSaveProfile = async () => {
    // Converter data para formato correto
    const updateData: any = {
      fullName: editForm.fullName,
      username: editForm.username,
      email: editForm.email,
      birthDate: editForm.birthDate ? new Date(editForm.birthDate).toISOString() : undefined,
      phone: editForm.phone || undefined
    };

    // Só incluir gender se tiver valor
    if (editForm.gender) {
      updateData.gender = editForm.gender;
    }
    
    console.log('Enviando dados:', updateData);
    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setHasChanges(false);
      }
    });
  };

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

  // Loading state
  if (isLoading) {
    return (
      <StandardLayout title="Meu Perfil" subtitle="Carregando seus dados...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Carregando perfil...</h2>
            <p className="text-text-muted">Buscando seus dados</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  // Error state
  if (isError) {
    return (
      <StandardLayout title="Meu Perfil" subtitle="Erro ao carregar dados">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar perfil</h2>
            <p className="text-text-muted">Não foi possível carregar seus dados</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'stats', label: 'Estatísticas', icon: TrendingUp },
    { id: 'achievements', label: 'Conquistas', icon: Award },
  ];

  // Dados reais do backend
  const profileStats = [
    { 
      label: 'Treinos Completados', 
      value: stats.data?.totalWorkouts?.toString() || '0', 
      icon: Activity, 
      color: 'text-green-400' 
    },
    { 
      label: 'Sequência Atual', 
      value: stats.data?.currentStreak?.toString() || '0', 
      icon: Zap, 
      color: 'text-yellow-400' 
    },
    { 
      label: 'Duração Média', 
      value: stats.data?.averageWorkoutDuration ? `${Math.round(stats.data.averageWorkoutDuration)}min` : '0min', 
      icon: Clock, 
      color: 'text-accent' 
    },
    { 
      label: 'Conquistas', 
      value: achievements.data?.length?.toString() || '0', 
      icon: Trophy, 
      color: 'text-purple-400' 
    },
  ];

  // Função para calcular idade
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <StandardLayout title="Meu Perfil" subtitle="Gerencie suas informações e acompanhe seu progresso">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-accent/15 via-accent/8 to-yellow-400/10 rounded-3xl border border-accent/30 p-8 mb-8 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-tr-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Picture Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <AvatarWithInitials 
                    name={currentUser.data?.fullName || user.fullName || 'Usuário'} 
                    size="w-36 h-36"
                  />
                  <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-200 shadow-lg border-2 border-accent cursor-pointer">
                    <Camera className="w-6 h-6 text-accent" />
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h1 className="text-4xl font-bold text-foreground">
                        {currentUser.data?.fullName || user.fullName}
                      </h1>
                      {levelInfo && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                          <Star className="w-5 h-5 text-accent" />
                          <span className="font-bold text-accent text-lg">
                            Nível {levelInfo.level}
                          </span>
                          <span className="text-sm text-text-muted">
                            • {levelInfo.totalXp} XP
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl text-text-muted mb-4">@{currentUser.data?.username || user.username}</p>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 text-sm">
                      {currentUser.data?.birthDate && (
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="text-foreground font-medium">{calculateAge(currentUser.data.birthDate)} anos</span>
                        </div>
                      )}
                      {currentUser.data?.gender && (
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                          <User className="w-4 h-4 text-accent" />
                          <span className="text-foreground font-medium">
                            {currentUser.data.gender === 'MALE' ? 'Masculino' : 
                             currentUser.data.gender === 'FEMALE' ? 'Feminino' : 
                             currentUser.data.gender === 'M' ? 'Masculino' :
                             currentUser.data.gender === 'F' ? 'Feminino' :
                             currentUser.data.gender}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-foreground font-medium">
                          Membro desde {currentUser.data?.createdAt ? new Date(currentUser.data.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleEditProfile}
                    className="mt-4 lg:mt-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-foreground font-semibold px-6 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 border border-white/30 cursor-pointer"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Editar Perfil</span>
                  </button>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.data?.phone && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-accent" />
                        <span className="font-medium text-foreground">Telefone</span>
                      </div>
                      <p className="text-sm text-text-muted">{currentUser.data.phone}</p>
                    </div>
                  )}
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-medium text-foreground">Localização</span>
                    </div>
                    <p className="text-sm text-text-muted">Brasil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conquistas e Badges - Seção Única do Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6 mb-6"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-accent" />
            Conquistas e Badges
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Skeleton Loading */}
            {!levelInfo && !stats.data && (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-6 bg-card-bg/30 rounded-2xl border border-border/20 animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl mx-auto mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </>
            )}
            {/* Badge de Nível */}
            {levelInfo && (
              <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-yellow-400/10 rounded-2xl border border-accent/20 hover:border-accent/40 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl animate-pulse opacity-20"></div>
                  <Star className="w-8 h-8 text-black group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                </div>
                <h4 className="font-bold text-foreground text-lg">Nível {levelInfo.level}</h4>
                <p className="text-sm text-text-muted">{levelInfo.totalXp} XP</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(levelInfo.currentLevelXp / levelInfo.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP para o próximo nível
                </p>
              </div>
            )}
            
            {/* Badge de Treinos */}
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/20 hover:border-green-500/40 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Trophy className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h4 className="font-bold text-foreground text-lg">{stats.data?.totalWorkouts || 0}</h4>
              <p className="text-sm text-text-muted">Treinos Completos</p>
              <div className="mt-2 text-xs text-green-400 font-medium">
                {stats.data?.totalWorkouts >= 10 ? 'Expert' : 
                 stats.data?.totalWorkouts >= 5 ? 'Intermediário' : 
                 stats.data?.totalWorkouts >= 1 ? 'Iniciante' : 'Começando'}
              </div>
            </div>
            
            {/* Badge de Sequência */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Activity className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="font-bold text-foreground text-lg">{stats.data?.currentStreak || 0}</h4>
              <p className="text-sm text-text-muted">Dias de Sequência</p>
              <div className="mt-2 text-xs text-blue-400 font-medium">
                {stats.data?.currentStreak >= 30 ? 'Incrível' : 
                 stats.data?.currentStreak >= 7 ? 'Bom' : 
                 stats.data?.currentStreak >= 1 ? 'Começando' : 'Vamos começar'}
              </div>
            </div>
            
            {/* Badge de Objetivos */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Target className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h4 className="font-bold text-foreground text-lg">{stats.data?.goalsAchieved || 0}</h4>
              <p className="text-sm text-text-muted">Metas Alcançadas</p>
              <div className="mt-2 text-xs text-purple-400 font-medium">
                {stats.data?.goalsAchieved >= 5 ? 'Focado' : 
                 stats.data?.goalsAchieved >= 2 ? 'Determinado' : 
                 stats.data?.goalsAchieved >= 1 ? 'Iniciante' : 'Vamos definir metas'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg/50 border border-border/30 rounded-xl p-1"
        >
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent to-yellow-400 text-black font-semibold'
                      : 'text-text-muted hover:text-foreground hover:bg-card-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Clock className="w-6 h-6 text-accent" />
                  Timeline de Atividades
                </h3>
                
                {/* Filtros */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'completed', label: 'Concluídos' },
                    { key: 'pending', label: 'Pendentes' },
                    { key: 'strength', label: 'Força' },
                    { key: 'cardio', label: 'Cardio' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setWorkoutFilter(filter.key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        workoutFilter === filter.key
                          ? 'bg-accent text-black'
                          : 'bg-card-bg/50 text-text-muted hover:bg-card-bg hover:text-foreground'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              {workouts.data && workouts.data.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const filteredWorkouts = workouts.data.filter((workout: any) => {
                      if (workoutFilter === 'all') return true;
                      if (workoutFilter === 'completed') return workout.isCompleted;
                      if (workoutFilter === 'pending') return !workout.isCompleted;
                      if (workoutFilter === 'strength') return workout.type?.toLowerCase().includes('strength') || workout.type?.toLowerCase().includes('força');
                      if (workoutFilter === 'cardio') return workout.type?.toLowerCase().includes('cardio');
                      return true;
                    });

                    if (filteredWorkouts.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-10 h-10 text-accent" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-2">Nenhum treino encontrado</h4>
                          <p className="text-text-muted">
                            {workoutFilter === 'completed' && 'Você ainda não completou nenhum treino'}
                            {workoutFilter === 'pending' && 'Não há treinos pendentes'}
                            {workoutFilter === 'strength' && 'Nenhum treino de força encontrado'}
                            {workoutFilter === 'cardio' && 'Nenhum treino de cardio encontrado'}
                            {workoutFilter === 'all' && 'Nenhum treino encontrado'}
                          </p>
                          <button 
                            onClick={() => setWorkoutFilter('all')}
                            className="mt-4 px-4 py-2 bg-accent/20 text-accent text-sm font-medium rounded-lg hover:bg-accent/30 transition-all duration-200 cursor-pointer"
                          >
                            Ver Todos os Treinos
                          </button>
                        </div>
                      );
                    }

                    return filteredWorkouts.slice(0, 8).map((workout: any, index: number) => (
                    <div key={workout.id} className="relative">
                      {/* Timeline Line */}
                      {index < workouts.data.slice(0, 8).length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-accent/30 to-transparent"></div>
                      )}
                      
                      <div className="flex items-start gap-4 p-4 bg-card-bg/50 rounded-2xl border border-border/20 hover:bg-card-bg/70 transition-all duration-200 hover:shadow-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
                            {React.createElement(getWorkoutTypeIcon(workout.type), { className: "w-6 h-6 text-white" })}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-foreground text-lg truncate">{workout.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              workout.isCompleted 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {workout.isCompleted ? 'Concluído' : 'Agendado'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(workout.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{workout.duration}min</span>
                            </div>
                            {workout.calories && (
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                <span>{workout.calories} cal</span>
                              </div>
                            )}
                            {workout.exercises && workout.exercises.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Dumbbell className="w-4 h-4" />
                                <span>{workout.exercises.length} exercícios</span>
                              </div>
                            )}
                          </div>
                          {workout.description && (
                            <p className="text-sm text-text-muted line-clamp-2">{workout.description}</p>
                          )}
                          
                          {/* Ações Rápidas */}
                          <div className="flex gap-2 mt-3">
                            {!workout.isCompleted && (
                              <button 
                                onClick={() => {
                                  // Implementar marcar como feito
                                  toast.success('Treino marcado como concluído!');
                                }}
                                className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-lg hover:bg-green-500/30 transition-all duration-200 border border-green-500/30 cursor-pointer"
                              >
                                Marcar como Feito
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedWorkout(workout);
                                setIsWorkoutModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-accent/20 text-accent text-xs font-medium rounded-lg hover:bg-accent/30 transition-all duration-200 border border-accent/30 cursor-pointer"
                            >
                              Ver Detalhes
                            </button>
                            <button 
                              onClick={() => {
                                // Implementar excluir
                                if (confirm('Tem certeza que deseja excluir este treino?')) {
                                  toast.success('Treino excluído com sucesso!');
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/30 transition-all duration-200 border border-red-500/30 cursor-pointer"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    ));
                  })()}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-12 h-12 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">Nenhuma atividade ainda</h4>
                  <p className="text-text-muted mb-6 max-w-md mx-auto">
                    Comece a treinar para ver sua timeline de atividades e acompanhar seu progresso
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-2xl hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 shadow-lg cursor-pointer">
                    Começar a Treinar
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Meus Objetivos
              </h3>
              {goals.data && goals.data.length > 0 ? (
                <div className="space-y-4">
                  {goals.data.map((goal: any) => (
                    <div key={goal.id} className="p-4 bg-card-bg/50 rounded-lg border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{goal.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {goal.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm mb-3">{goal.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-muted">
                            {goal.goalType === 'WEIGHT_LOSS' || goal.goalType === 'LOSE_WEIGHT' ? 'Perda de Peso' :
                             goal.goalType === 'WEIGHT_GAIN' || goal.goalType === 'GAIN_WEIGHT' ? 'Ganho de Peso' :
                             goal.goalType === 'MUSCLE_GAIN' || goal.goalType === 'GAIN_MASS' ? 'Ganho de Massa' :
                             goal.goalType === 'ENDURANCE' ? 'Resistência' :
                             goal.goalType === 'MAINTAIN_WEIGHT' ? 'Manter Peso' :
                             goal.goalType === 'IMPROVE_FITNESS' || goal.goalType === 'IMPROVE_CONDITIONING' ? 'Melhorar Condicionamento' :
                             goal.goalType === 'STRENGTH' ? 'Força' :
                             goal.goalType === 'FLEXIBILITY' ? 'Flexibilidade' :
                             goal.goalType === 'CARDIO' ? 'Cardio' :
                             goal.goalType}
                          </span>
                        </div>
                        <div className="text-sm text-text-muted">
                          Criado em {new Date(goal.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-12 h-12 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Nenhum objetivo ativo</h4>
                  <p className="text-text-muted mb-4">Defina seus objetivos para começar a treinar</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-semibold rounded-lg hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer">
                    Criar Objetivo
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Estatísticas Detalhadas
              </h3>
              {stats.data ? (
                <div className="space-y-8">
                  {/* Seção de Nível e XP */}
                  {levelInfo && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        Nível e XP
                      </h4>
                      <div className="space-y-4">
                        {/* Card Principal de Nível */}
                        <div className="p-6 bg-gradient-to-br from-accent/10 to-yellow-400/10 rounded-xl border border-accent/20">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h5 className="text-3xl font-bold text-accent mb-2">
                                Nível {levelInfo.level}
                              </h5>
                              <p className="text-sm text-text-muted">
                                {levelInfo.level === 1 && "Iniciante"}
                                {levelInfo.level >= 2 && levelInfo.level <= 5 && "Em desenvolvimento"}
                                {levelInfo.level >= 6 && levelInfo.level <= 10 && "Intermediário"}
                                {levelInfo.level >= 11 && levelInfo.level <= 20 && "Avançado"}
                                {levelInfo.level > 20 && "Expert"}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-bold text-foreground">
                                {levelInfo.totalXp}
                              </div>
                              <div className="text-sm text-text-muted">XP Total</div>
                            </div>
                          </div>
                          
                          {/* Barra de Progresso Melhorada */}
                          <div className="mb-6">
                            <div className="flex justify-between text-sm text-text-muted mb-3">
                              <span>Progresso para Nível {levelInfo.level + 1}</span>
                              <span className="font-medium">{levelInfo.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-accent to-yellow-400 h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                                style={{ width: `${levelInfo.progressPercentage}%` }}
                              >
                                <Star className="w-3 h-3 text-black" />
                              </div>
                            </div>
                          </div>

                          {/* Informações Detalhadas */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-card-bg/30 p-4 rounded-lg">
                              <div className="text-text-muted mb-2">XP Atual do Nível</div>
                              <div className="font-semibold text-foreground text-lg">{levelInfo.currentLevelXp} XP</div>
                            </div>
                            <div className="bg-card-bg/30 p-4 rounded-lg">
                              <div className="text-text-muted mb-2">XP para Próximo</div>
                              <div className="font-semibold text-accent text-lg">{levelInfo.xpToNextLevel} XP</div>
                            </div>
                          </div>
                        </div>

                        {/* Grid de Cards - Como Ganhar XP e Próximos Marcos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Sistema de Recompensas */}
                          <div className="p-6 bg-card-bg/50 rounded-xl border border-border/50">
                            <h6 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-accent" />
                              Como Ganhar XP
                            </h6>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg hover:bg-card-bg/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                  <span className="text-text-muted font-medium">Treino Completado</span>
                                </div>
                                <span className="font-semibold text-green-400">+50 XP</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg hover:bg-card-bg/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                  <span className="text-text-muted font-medium">Desafio Diário</span>
                                </div>
                                <span className="font-semibold text-blue-400">+30 XP</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg hover:bg-card-bg/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                  <span className="text-text-muted font-medium">Conquista Desbloqueada</span>
                                </div>
                                <span className="font-semibold text-purple-400">+100 XP</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg hover:bg-card-bg/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                  <span className="text-text-muted font-medium">Sequência Semanal</span>
                                </div>
                                <span className="font-semibold text-orange-400">+75 XP</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg hover:bg-card-bg/40 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                                  <span className="text-text-muted font-medium">Check-in Academia</span>
                                </div>
                                <span className="font-semibold text-cyan-400">+25 XP</span>
                              </div>
                            </div>
                          </div>

                          {/* Próximos Níveis */}
                          <div className="p-6 bg-card-bg/50 rounded-xl border border-border/50">
                            <h6 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-accent" />
                              Próximos Marcos
                            </h6>
                            <div className="space-y-3 text-sm">
                              {levelInfo.level < 5 && (
                                <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg">
                                  <span className="text-text-muted font-medium">Nível 5 - Desenvolvido</span>
                                  <span className="font-semibold text-accent">
                                    {Math.max(0, Math.floor(100 * Math.pow(1.5, 4)) - levelInfo.totalXp)} XP restantes
                                  </span>
                                </div>
                              )}
                              {levelInfo.level < 10 && (
                                <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg">
                                  <span className="text-text-muted font-medium">Nível 10 - Intermediário</span>
                                  <span className="font-semibold text-accent">
                                    {Math.max(0, Math.floor(100 * Math.pow(1.5, 9)) - levelInfo.totalXp)} XP restantes
                                  </span>
                                </div>
                              )}
                              {levelInfo.level < 20 && (
                                <div className="flex justify-between items-center p-3 bg-card-bg/30 rounded-lg">
                                  <span className="text-text-muted font-medium">Nível 20 - Avançado</span>
                                  <span className="font-semibold text-accent">
                                    {Math.max(0, Math.floor(100 * Math.pow(1.5, 19)) - levelInfo.totalXp)} XP restantes
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-text-muted mt-4 p-3 bg-card-bg/20 rounded-lg">
                                Continue treinando para alcançar novos níveis!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground mb-3">Treinos</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Total de Treinos</span>
                        <span className="font-semibold text-foreground">{stats.data.totalWorkouts || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Esta Semana</span>
                        <span className="font-semibold text-foreground">{stats.data.weeklyWorkouts || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Duração Média</span>
                        <span className="font-semibold text-foreground">
                          {stats.data.averageWorkoutDuration ? `${Math.round(stats.data.averageWorkoutDuration)} min` : '0 min'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground mb-3">Sequências</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Sequência Atual</span>
                        <span className="font-semibold text-foreground">{stats.data.currentStreak || 0} dias</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Melhor Sequência</span>
                        <span className="font-semibold text-foreground">{stats.data.bestStreak || 0} dias</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card-bg/50 rounded-lg">
                        <span className="text-text-muted">Dias Ativos (Mês)</span>
                        <span className="font-semibold text-foreground">{stats.data.activeDaysLastMonth || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-12 h-12 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Carregando estatísticas...</h4>
                  <p className="text-text-muted">Buscando seus dados</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Conquistas
              </h3>
              {achievements.data && achievements.data.length > 0 ? (
                <div className="grid gap-4">
                  {achievements.data.map((achievement: any, index: number) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 bg-card-bg/50 rounded-xl border border-border/30"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                        <p className="text-sm text-text-muted">{achievement.description}</p>
                        <p className="text-xs text-accent mt-1">
                          {achievement.unlockedAt 
                            ? `Desbloqueada em ${new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}`
                            : 'Não desbloqueada'
                          }
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.unlockedAt 
                          ? 'bg-gradient-to-r from-accent to-yellow-400' 
                          : 'bg-gray-500/20'
                      }`}>
                        <Award className={`w-4 h-4 ${achievement.unlockedAt ? 'text-black' : 'text-gray-400'}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-12 h-12 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Nenhuma conquista ainda</h4>
                  <p className="text-text-muted">Continue treinando para desbloquear conquistas!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de Edição de Perfil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card-bg border border-border/50 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Editar Perfil</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={editForm.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gênero
                </label>
                <select
                  value={editForm.gender || ""}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 bg-input-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecione</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-transparent border border-border text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-all duration-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending || !hasChanges || !editForm.gender}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 disabled:from-accent/50 disabled:to-yellow-400/50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </motion.div>
        </div>
        )}

        {/* Modal de Detalhes do Treino */}
        <AnimatePresence>
          {isWorkoutModalOpen && selectedWorkout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsWorkoutModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card-bg border border-border/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getWorkoutTypeColor(selectedWorkout.type)} rounded-xl flex items-center justify-center`}>
                      {React.createElement(getWorkoutTypeIcon(selectedWorkout.type), { className: "w-5 h-5 text-white" })}
                    </div>
                    {selectedWorkout.name}
                  </h2>
                  <button
                    onClick={() => setIsWorkoutModalOpen(false)}
                    className="text-text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">Duração</span>
                      </div>
                      <p className="text-lg font-bold text-accent">{selectedWorkout.duration}min</p>
                    </div>
                    
                    {selectedWorkout.calories && (
                      <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">Calorias</span>
                        </div>
                        <p className="text-lg font-bold text-accent">{selectedWorkout.calories} cal</p>
                      </div>
                    )}
                    
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">Data</span>
                      </div>
                      <p className="text-lg font-bold text-accent">
                        {new Date(selectedWorkout.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">Status</span>
                      </div>
                      <p className={`text-lg font-bold ${
                        selectedWorkout.isCompleted ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {selectedWorkout.isCompleted ? 'Concluído' : 'Agendado'}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  {selectedWorkout.description && (
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Descrição</h3>
                      <p className="text-text-muted">{selectedWorkout.description}</p>
                    </div>
                  )}

                  {/* Exercícios */}
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-accent" />
                        Exercícios ({selectedWorkout.exercises.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedWorkout.exercises.map((exercise: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-card-bg rounded-lg border border-border/10">
                            <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                              <div className="flex gap-4 text-sm text-text-muted mt-1">
                                {exercise.sets && <span>{exercise.sets} séries</span>}
                                {exercise.reps && <span>{exercise.reps} reps</span>}
                                {exercise.weight && <span>{exercise.weight}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {selectedWorkout.notes && (
                    <div className="bg-card-bg/50 rounded-xl p-4 border border-border/20">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Notas</h3>
                      <p className="text-text-muted">{selectedWorkout.notes}</p>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsWorkoutModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-transparent border border-border text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    Fechar
                  </button>
                  {!selectedWorkout.isCompleted && (
                    <button
                      onClick={() => {
                        toast.success('Treino marcado como concluído!');
                        setIsWorkoutModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      Marcar como Concluído
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </StandardLayout>
  );
}
