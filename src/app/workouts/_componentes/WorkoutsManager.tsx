'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Plus, 
  Calendar, 
  BarChart3, 
  List, 
  Grid3X3,
  Target,
  Activity,
  Zap,
  Clock,
  Flame
} from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { WorkoutType } from '@/types/workouts';
import { WorkoutsList } from './WorkoutsList';
import { WorkoutsStats } from './WorkoutsStats';
import { WorkoutCalendar } from './WorkoutCalendar';
import { RegisterWorkoutModal } from '@/app/dashboard/_componentes/RegisterWorkoutModal';

export function WorkoutsManager() {
  const { workouts, isLoading, error, stats } = useWorkouts();
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar apenas treinos criados pelo usuário para estatísticas
  const userCreatedWorkouts = workouts.filter(w => w.source === 'user-created');

  const workoutTypes = [
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-accent/80 via-yellow-500/70 to-amber-600/60', count: userCreatedWorkouts.filter(w => w.type === WorkoutType.STRENGTH).length },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-slate-600 via-slate-500 to-slate-400', count: userCreatedWorkouts.filter(w => w.type === WorkoutType.CARDIO).length },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-orange-600/80 via-amber-600/70 to-accent/60', count: userCreatedWorkouts.filter(w => w.type === WorkoutType.FLEXIBILITY).length },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-amber-700/80 via-accent/70 to-yellow-500/60', count: userCreatedWorkouts.filter(w => w.type === WorkoutType.MIXED).length },
  ];

  const totalWorkouts = userCreatedWorkouts.length;
  const totalDuration = stats.totalDuration;
  const totalCalories = stats.totalCalories;
  const averageDuration = stats.averageDuration;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Dumbbell className="w-8 h-8 text-black" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Carregando treinos...</h2>
          <p className="text-text-muted">Buscando seus dados de treino</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Erro ao carregar treinos</h2>
          <p className="text-text-muted mb-4">{error?.message || 'Erro desconhecido'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-background font-semibold rounded-lg transition-all duration-200 cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted font-medium">Total de Treinos</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">{totalWorkouts}</p>
                <p className="text-xs text-text-muted mt-1">Este mês</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-accent/10 to-yellow-300/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="w-8 h-8 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted font-medium">Tempo Total</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{Math.round(totalDuration / 60)}h</p>
                <p className="text-xs text-text-muted mt-1">Acumulado</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-red-500/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted font-medium">Calorias Queimadas</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">{totalCalories.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">kcal</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Flame className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-green-500/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted font-medium">Duração Média</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">{averageDuration}min</p>
                <p className="text-xs text-text-muted mt-1">Por treino</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 via-green-500/10 to-green-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workout Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/5 backdrop-blur-sm rounded-3xl p-8 border border-border/30 shadow-xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Tipos de Treino</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {workoutTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className={`group p-6 rounded-2xl bg-gradient-to-br ${type.color} text-white cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{type.label}</p>
                        <p className="text-sm opacity-90">{type.count} treinos</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white/40 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((type.count / Math.max(...workoutTypes.map(t => t.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-gradient-to-r from-input-bg to-input-bg/80 backdrop-blur-sm rounded-2xl p-2 border border-border/30 shadow-lg">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-accent to-yellow-300 text-black shadow-lg transform scale-105'
                  : 'text-text-muted hover:text-foreground hover:bg-card-bg/50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendário
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-accent to-yellow-300 text-black shadow-lg transform scale-105'
                  : 'text-text-muted hover:text-foreground hover:bg-card-bg/50'
              }`}
            >
              <List className="w-5 h-5" />
              Lista de Treinos
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-accent to-yellow-300 text-black shadow-lg transform scale-105'
                  : 'text-text-muted hover:text-foreground hover:bg-card-bg/50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Estatísticas
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode - Only show for List tab */}
            {activeTab === 'list' && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-input-bg to-input-bg/80 backdrop-blur-sm rounded-2xl p-1 border border-border/30 shadow-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-accent to-yellow-300 text-black shadow-lg transform scale-105'
                      : 'text-text-muted hover:text-foreground hover:bg-card-bg/50'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-accent to-yellow-300 text-black shadow-lg transform scale-105'
                      : 'text-text-muted hover:text-foreground hover:bg-card-bg/50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'calendar' ? (
          <WorkoutCalendar />
        ) : activeTab === 'list' ? (
          <WorkoutsList 
            viewMode={viewMode}
          />
        ) : (
          <WorkoutsStats />
        )}
      </div>

      {/* Modals */}
      {showRegisterModal && (
        <RegisterWorkoutModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}
