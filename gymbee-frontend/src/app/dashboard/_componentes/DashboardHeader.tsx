'use client';

import { bee } from '@lucide/lab';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, Zap, Icon } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
  onMenuClick: () => void;
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
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
        <div className="flex items-center justify-between">
          {/* Left Side */}
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
                <h1 className="text-2xl font-bold text-foreground">
                  {getGreeting()}, {user?.fullName?.split(' ')[0]}!
                </h1>
                <p className="text-text-muted text-sm">
                  {getSubtitle()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-input-bg border border-input-border rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent text-foreground placeholder-text-muted focus:outline-none text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
