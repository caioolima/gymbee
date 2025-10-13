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
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-300 rounded-lg flex items-center justify-center">
              <Icon iconNode={bee} size={24} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {getGreeting()}, {user?.fullName?.split(' ')[0]}!
                </h1>
                {levelInfo && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-accent/20 to-yellow-400/20 px-2 py-1 rounded-full border border-accent/30">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      Nível {levelInfo.level}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-text-muted text-sm">
                {getSubtitle()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
