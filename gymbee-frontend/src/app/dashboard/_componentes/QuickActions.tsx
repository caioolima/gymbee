'use client';

import { motion } from 'framer-motion';
import { Plus, Target, Users, BarChart3, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  user: any;
}

export function QuickActions({ user }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'new-workout':
        router.push('/workouts');
        break;
      case 'set-goal':
        router.push('/dashboard?tab=goals');
        break;
      case 'find-trainer':
        router.push('/trainers');
        break;
      case 'progress':
        router.push('/dashboard?tab=progress');
        break;
      default:
        console.log('Ação não implementada:', actionId);
    }
  };

  const actions = [
    {
      id: 'new-workout',
      title: 'Novo Treino',
      description: 'Registre seus exercícios e acompanhe seu desempenho',
      icon: Plus,
      color: 'from-accent via-yellow-400 to-amber-500',
      bgColor: 'from-accent/10 to-amber-500/10',
      details: 'Exercícios • Duração • Calorias',
    },
    {
      id: 'set-goal',
      title: 'Definir Objetivo',
      description: 'Estabeleça metas personalizadas para sua jornada fitness',
      icon: Target,
      color: 'from-slate-600 via-slate-500 to-slate-400',
      bgColor: 'from-slate-600/10 to-slate-400/10',
      details: 'Peso • Força • Resistência',
    },
    {
      id: 'find-trainer',
      title: 'Encontrar Trainer',
      description: 'Conecte-se com profissionais qualificados',
      icon: Users,
      color: 'from-orange-500 via-amber-500 to-accent',
      bgColor: 'from-orange-500/10 to-accent/10',
      details: 'Personal • Nutricionista • Coach',
    },
    {
      id: 'progress',
      title: 'Progresso',
      description: 'Visualize sua evolução e conquistas alcançadas',
      icon: BarChart3,
      color: 'from-accent via-yellow-400 to-amber-500',
      bgColor: 'from-accent/10 to-amber-500/10',
      details: 'Gráficos • Estatísticas • Histórico',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="group bg-gradient-to-br from-card-bg via-card-bg/95 to-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-border/30 shadow-xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-base text-text-muted font-semibold">Ações Rápidas</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent mt-1">
              Acesso Rápido
            </p>
            <p className="text-base font-semibold text-foreground mt-1">
              Principais funcionalidades
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Target className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleActionClick(action.id)}
                className="group bg-gradient-to-br from-input-bg/50 to-input-bg/30 hover:from-input-bg/70 hover:to-input-bg/50 border border-border/30 hover:border-accent/30 rounded-xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden text-left"
              >
                {/* Card shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">
                      {action.title}
                    </h4>
                    
                    <p className="text-base text-text-muted leading-relaxed mb-3">
                      {action.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                      <p className="text-sm font-medium text-accent">
                        {action.details}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}
