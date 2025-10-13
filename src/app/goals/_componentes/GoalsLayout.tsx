'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Target, TrendingUp, TrendingDown, Calendar as CalendarIcon, Clock, Apple, Activity, Trophy, Award, BarChart3, Dumbbell } from 'lucide-react';
import { InstagramSidebar } from '@/components/InstagramSidebar';
import { GoalsHeader } from './GoalsHeader';
import { ActiveGoalCard } from './ActiveGoalCard';
import { GoalsHistory } from './GoalsHistory';
import { CreateGoalDialog } from './CreateGoalDialog';

interface GoalsLayoutProps {
  user: any;
}

export function GoalsLayout({ user }: GoalsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <InstagramSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <GoalsHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onCreateGoal={() => setIsCreateDialogOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Active Goal Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Objetivo Ativo</h2>
              <ActiveGoalCard user={user} />
            </div>

            {/* Goal Milestones Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Marcos do Objetivo</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card-bg border border-border rounded-xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Milestone 1 */}
                  <div className="bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">25% do Objetivo</h4>
                        <p className="text-xs text-text-muted">Primeiro marco</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div className="bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">50% do Objetivo</h4>
                        <p className="text-xs text-text-muted">Metade do caminho</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>

                  {/* Milestone 3 */}
                  <div className="bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">75% do Objetivo</h4>
                        <p className="text-xs text-text-muted">Quase lá!</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* Milestone 4 */}
                  <div className="bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">100% do Objetivo</h4>
                        <p className="text-xs text-text-muted">Meta alcançada!</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tips and Recommendations Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Dicas e Recomendações</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {/* Nutrition Tips */}
                <div className="bg-card-bg border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                      <Apple className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Dicas de Nutrição</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Mantenha uma alimentação balanceada com proteínas, carboidratos e gorduras saudáveis</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Beba pelo menos 2-3 litros de água por dia</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Evite alimentos processados e açúcares refinados</p>
                    </div>
                  </div>
                </div>

                {/* Exercise Tips */}
                <div className="bg-card-bg border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Dicas de Exercício</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Mantenha consistência nos treinos, mesmo que sejam curtos</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Varie os tipos de exercícios para evitar monotonia</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-text-muted">Descanse adequadamente entre os treinos</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Goals History Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Histórico de Objetivos</h2>
              <GoalsHistory user={user} />
            </div>
          </motion.div>
        </main>
      </div>

      {/* Create Goal Dialog */}
      <CreateGoalDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        user={user}
      />
    </div>
  );
}
