'use client';

import { useState } from 'react';
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
  User,
  Dumbbell,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WorkoutsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso! 👋');
    router.push('/home');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, href: '/workouts', active: true },
    { id: 'goals', label: 'Objetivos', icon: Target, href: '/goals' },
    { id: 'trainers', label: 'Trainers', icon: Users, href: '/trainers' },
    { id: 'profile', label: 'Perfil', icon: User, href: '/profile' },
    { id: 'settings', label: 'Configurações', icon: Settings, href: '/settings' },
  ];

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
              const isActive = item.active;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                    }
                  }}
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
        <header className="bg-gradient-to-r from-card-bg to-card-bg/90 backdrop-blur-sm border-b border-border/50 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-input-bg rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-text-muted" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Dumbbell className="w-6 h-6 text-accent" />
                    Meus Treinos
                  </h1>
                  <p className="text-text-muted text-sm">
                    Gerencie e acompanhe todos os seus treinos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // TODO: Implementar modal de novo treino
                    console.log('Novo treino clicado');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Treino
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
