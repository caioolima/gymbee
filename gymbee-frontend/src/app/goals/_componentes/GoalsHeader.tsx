'use client';

import { motion } from 'framer-motion';
import { Menu, Target, Plus } from 'lucide-react';

interface GoalsHeaderProps {
  user: any;
  onMenuClick: () => void;
  onCreateGoal: () => void;
}

export function GoalsHeader({ user, onMenuClick, onCreateGoal }: GoalsHeaderProps) {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-card-bg rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Objetivos</h1>
              <p className="text-sm text-text-muted">Gerencie seus objetivos fitness</p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onCreateGoal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-yellow-300 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Novo Objetivo
          </motion.button>
        </div>
      </div>
    </header>
  );
}
