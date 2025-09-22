'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Flame, 
  Target,
  Dumbbell,
  Activity,
  Zap
} from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { WorkoutType } from '@/types/workouts';

export function WorkoutsStats() {
  const { workouts, stats } = useWorkouts();

  const workoutTypes = [
    { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-red-500 to-red-600' },
    { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-blue-500 to-blue-600' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-green-500 to-green-600' },
    { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-purple-500 to-purple-600' },
  ];

  // Calcular estatísticas por tipo
  const typeStats = workoutTypes.map(type => {
    const typeWorkouts = workouts.filter(w => w.type === type.value);
    const totalDuration = typeWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = typeWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    const averageDuration = typeWorkouts.length > 0 ? Math.round(totalDuration / typeWorkouts.length) : 0;
    
    return {
      ...type,
      count: typeWorkouts.length,
      totalDuration,
      totalCalories,
      averageDuration,
      percentage: workouts.length > 0 ? Math.round((typeWorkouts.length / workouts.length) * 100) : 0,
    };
  });

  // Calcular estatísticas por mês (últimos 6 meses)
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.createdAt);
      return workoutDate >= monthStart && workoutDate <= monthEnd;
    });
    
    const totalDuration = monthWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = monthWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      count: monthWorkouts.length,
      totalDuration,
      totalCalories,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total de Treinos</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalWorkouts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Tempo Total</p>
              <p className="text-3xl font-bold text-foreground">{Math.round(stats.totalDuration / 60)}h</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Calorias Queimadas</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalCalories.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Duração Média</p>
              <p className="text-3xl font-bold text-foreground">{stats.averageDuration}min</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Workout Types Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Distribuição por Tipo
        </h3>
        
        <div className="space-y-4">
          {typeStats.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-foreground">{type.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">{type.count}</span>
                    <span className="text-sm text-text-muted ml-2">({type.percentage}%)</span>
                  </div>
                </div>
                
                <div className="w-full bg-input-bg rounded-full h-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${type.color} rounded-full transition-all duration-500`}
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{type.averageDuration}min média</span>
                  <span>{type.totalCalories.toLocaleString()} cal</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Progresso Mensal
        </h3>
        
        <div className="space-y-4">
          {monthlyStats.map((month, index) => (
            <div key={month.month} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium text-foreground">{month.month}</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-text-muted">
                  <Dumbbell className="w-4 h-4" />
                  <span>{month.count} treinos</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(month.totalDuration / 60)}h</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                  <Flame className="w-4 h-4" />
                  <span>{month.totalCalories.toLocaleString()} cal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Streak Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Sequência de Treinos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-sm text-text-muted mb-2">Sequência Atual</p>
            <p className="text-4xl font-bold text-accent">{stats.currentStreak}</p>
            <p className="text-sm text-text-muted">dias consecutivos</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-muted mb-2">Melhor Sequência</p>
            <p className="text-4xl font-bold text-accent">{stats.bestStreak}</p>
            <p className="text-sm text-text-muted">dias consecutivos</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
