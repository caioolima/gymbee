'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Target, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X,
  Trophy,
  Activity,
  TrendingUp,
  User,
  Dumbbell,
  BarChart3,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { ActiveGoalCard } from './ActiveGoalCard';
import { LastWorkoutCardWithModals } from './LastWorkoutCard';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  user: any;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso! 👋');
    router.push('/home');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, href: '/workouts' },
    { id: 'goals', label: 'Objetivos', icon: Target, href: '/goals' },
    { id: 'analytics', label: 'Análises', icon: BarChart3, href: '/analytics' },
    { id: 'trainers', label: 'Trainers', icon: Users, href: '/trainers' },
    { id: 'profile', label: 'Perfil', icon: User, href: '/profile' },
    { id: 'settings', label: 'Configurações', icon: Settings, href: '/settings' },
  ];

  const handleNavigation = (item: any) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-background border-r border-border h-full flex-shrink-0 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative z-50 lg:z-auto`}>
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/images/logo-gymbee.svg" 
              alt="GymBee" 
              className="h-8 w-auto"
            />
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-card-bg border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.fullName}</p>
                <p className="text-sm text-text-muted">{user?.role === 'USER' ? 'Membro' : 'Trainer'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-text-muted hover:text-foreground hover:bg-card-bg'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

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
              <QuickActions user={user} />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
