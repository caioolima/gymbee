'use client';

import { bee } from '@lucide/lab';
import { motion } from 'framer-motion';
import { Menu, Icon, Star } from 'lucide-react';
import { useUserLevel } from '@/hooks/useUserLevelQuery';

interface DashboardHeaderProps {
  user: any;
  onMenuClick: () => void;
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const { levelInfo } = useUserLevel();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getSubtitle = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Quais os planos para hoje?';
    if (hour < 18) return 'Bem-vindo de volta!';
    return 'Bem-vindo de volta!';
  };


  return (
    <header className="bg-gradient-to-r from-card-bg/80 to-card-bg/60 backdrop-blur-sm border-b border-border/50 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-3 text-text-muted hover:text-foreground hover:bg-accent/10 rounded-xl transition-all duration-200 cursor-pointer border border-border/30 hover:border-accent/30 flex-shrink-0"
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon iconNode={bee} size={24} className="text-black" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                  {getGreeting()}, {user?.fullName?.split(' ')[0]}!
                </h1>
                {levelInfo && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-accent/20 to-yellow-400/20 px-2 py-1 rounded-full border border-accent/30 flex-shrink-0">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      Nível {levelInfo.level}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-text-muted text-sm truncate">
                {getSubtitle()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
