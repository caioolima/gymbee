'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { InstagramSidebar } from '@/components/InstagramSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { ActiveGoalCard } from './ActiveGoalCard';
import { ArticlesCarousel } from './ArticlesCarousel';
import { LastWorkoutCardWithModals } from './LastWorkoutCard';
import { RecentActivity } from './RecentActivity';
import { UserRanking } from './UserRanking';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  user: any;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        <DashboardHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <DashboardStats user={user} />
              <div className="grid lg:grid-cols-3 gap-6">
                <ActiveGoalCard user={user} />
                <LastWorkoutCardWithModals user={user} />
                <RecentActivity user={user} />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <ArticlesCarousel user={user} />
                <UserRanking user={user} />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
