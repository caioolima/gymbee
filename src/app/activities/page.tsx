'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Clock, Target, Trophy, Zap, TrendingUp, Filter, Dumbbell, Scale, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivitiesQuery';
import { StandardLayout } from '@/components/StandardLayout';

export default function ActivitiesPage() {
  const { user, token } = useAuth();
  const [filter, setFilter] = useState('all');
  const { activities, isLoading, error } = useActivities();

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

  const filters = [
    { key: 'all', label: 'Todas', icon: Activity },
    { key: 'workout', label: 'Treinos', icon: Dumbbell },
    { key: 'challenge', label: 'Desafios', icon: Zap },
    { key: 'achievement', label: 'Conquistas', icon: Trophy },
    { key: 'weight', label: 'Peso', icon: Scale },
  ];

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return Dumbbell;
      case 'challenge':
        return Zap;
      case 'achievement':
        return Trophy;
      case 'weight':
        return Scale;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-accent';
      case 'challenge':
        return 'text-orange-500';
      case 'achievement':
        return 'text-amber-500';
      case 'weight':
        return 'text-slate-400';
      default:
        return 'text-slate-500';
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-accent/10';
      case 'challenge':
        return 'bg-orange-500/10';
      case 'achievement':
        return 'bg-amber-500/10';
      case 'weight':
        return 'bg-slate-500/10';
      default:
        return 'bg-slate-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const translateMetadataKey = (key: string) => {
    const translations: { [key: string]: string } = {
      'points': 'Pontos',
      'isCompleted': 'Status',
      'workoutType': 'Tipo',
      'source': 'Origem',
      'achievementType': 'Tipo',
      'isRead': 'Lido',
      'weight': 'Peso',
      'notes': 'Observações'
    };
    return translations[key] || key;
  };

  const translateMetadataValue = (key: string, value: any) => {
    if (key === 'isCompleted') {
      return value ? 'Concluído' : 'Pendente';
    }
    
    if (key === 'workoutType') {
      const types: { [key: string]: string } = {
        'STRENGTH': 'Força',
        'CARDIO': 'Cardio',
        'FLEXIBILITY': 'Flexibilidade',
        'FUNCTIONAL': 'Funcional'
      };
      return types[value] || value;
    }
    
    if (key === 'source') {
      const sources: { [key: string]: string } = {
        'user-created': 'Personalizado',
        'template': 'Pré-definido'
      };
      return sources[value] || value;
    }
    
    if (key === 'achievementType') {
      const types: { [key: string]: string } = {
        'WEEK_STREAK': 'Sequência Semanal',
        'MONTH_STREAK': 'Sequência Mensal',
        'FIRST_WORKOUT': 'Primeiro Treino',
        'GOAL_COMPLETED': 'Objetivo Concluído'
      };
      return types[value] || value;
    }
    
    if (key === 'isRead') {
      return value ? 'Sim' : 'Não';
    }
    
    if (key === 'notes' && value === null) {
      return 'Nenhuma';
    }
    
    return String(value);
  };

  if (isLoading) {
    return (
      <StandardLayout title="Atividades" subtitle="Acompanhe sua jornada">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Atividades" subtitle="Erro ao carregar">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar atividades</h2>
          <p className="text-text-muted">{error}</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Atividades" subtitle="Acompanhe sua jornada">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
          
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Filtrar Atividades</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {filters.map((filterOption) => {
                const Icon = filterOption.icon;
                return (
                  <motion.button
                    key={filterOption.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filterOption.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      filter === filterOption.key
                        ? 'bg-gradient-to-r from-accent to-yellow-400 text-black shadow-lg shadow-accent/25'
                        : 'bg-card-bg/50 text-text-muted hover:bg-card-bg/80 border border-border/30 hover:border-accent/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filterOption.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredActivities?.map((activity: any, index: number) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            const bgColorClass = getActivityBgColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${bgColorClass} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${colorClass}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDate(activity.date)}
                        </div>
                      </div>
                      
                      <p className="text-text-muted mb-4 leading-relaxed">
                        {activity.description}
                      </p>
                      
                      {activity.metadata && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(activity.metadata).map(([key, value]) => {
                            const translatedKey = translateMetadataKey(key);
                            const translatedValue = translateMetadataValue(key, value);
                            
                            return (
                              <span
                                key={key}
                                className="bg-card-bg/50 text-text-muted px-3 py-1 rounded-lg text-xs border border-border/30"
                              >
                                {translatedKey}: {translatedValue}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredActivities?.length === 0 && (
          <div className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
            
            <div className="relative z-10 text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {filter === 'all' ? 'Nenhuma atividade encontrada' : `Nenhuma atividade de ${filters.find(f => f.key === filter)?.label.toLowerCase()} encontrada`}
              </h3>
              <p className="text-text-muted">
                {filter === 'all' 
                  ? 'Comece a treinar para ver suas atividades aqui!' 
                  : 'Tente outro filtro ou comece a treinar!'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </StandardLayout>
  );
  }
