'use client';

import { motion } from 'framer-motion';
import { Activity, Trophy, Target, Clock, Dumbbell, Scale, Award, Zap, ArrowRight } from 'lucide-react';
import { useActivities } from '@/hooks/useActivitiesQuery';
import { useRouter } from 'next/navigation';

interface RecentActivityProps {
  user: any;
}

export function RecentActivity({ user }: RecentActivityProps) {
  const router = useRouter();
  const { activities, isLoading } = useActivities(3);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return Dumbbell;
      case 'weight':
        return Scale;
      case 'achievement':
        return Award;
      case 'challenge':
        return Zap;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-accent';
      case 'weight':
        return 'text-slate-400';
      case 'achievement':
        return 'text-amber-500';
      case 'challenge':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-accent/10';
      case 'weight':
        return 'bg-slate-500/10';
      case 'achievement':
        return 'bg-amber-500/10';
      case 'challenge':
        return 'bg-orange-500/10';
      default:
        return 'bg-slate-500/10';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Atividades Recentes</h3>
                <p className="text-base text-text-muted">Carregando...</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-base text-text-muted font-semibold">Atividades Recentes</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent mt-1">
              {activities.length > 0 ? `${activities.length}` : '0'}
            </p>
            <p className="text-base font-semibold text-foreground mt-1">
              {activities.length > 0 ? 'atividades registradas' : 'Nenhuma atividade'}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        {activities.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-center h-full py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-300 mb-2">Nenhuma atividade recente</p>
            <p className="text-base text-slate-400">Suas atividades aparecerão aqui</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                const bgColorClass = getActivityBgColor(activity.type);
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <div className={`w-8 h-8 ${bgColorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-foreground mb-1">
                        {activity.title}
                      </p>
                      <p className="text-base text-text-muted mb-2 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                          {formatTimeAgo(activity.date)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Ver Mais Button */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/activities')}
                className="w-full bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm">Ver Todas as Atividades</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}