'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  Link, 
  Settings, 
  LogOut,
  User,
  Dumbbell,
  ChevronDown,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { AvatarWithInitials } from './AvatarWithInitials';

interface InstagramSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function InstagramSidebar({ sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }: InstagramSidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, href: '/workouts' },
    { id: 'goals', label: 'Objetivos', icon: Target, href: '/goals' },
    { id: 'partners', label: 'Parceiros', icon: Link, href: '/partners' },
    { id: 'trainers', label: 'Trainers', icon: Zap, href: '/trainers' },
  ];

  const handleNavigation = (item: any) => {
    if (item.href) {
      router.push(item.href);
      setSidebarOpen(false);
    }
  };

  // Evitar hidratação mismatch
  if (!mounted) {
    return (
      <div className="w-64 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl border-r border-border/50 h-full flex-shrink-0 shadow-2xl">
        <div className="p-6 h-full flex flex-col relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                GymBee
              </h1>
              <p className="text-xs text-text-muted">Fitness Network</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl border-r border-border/50 h-full flex-shrink-0 transition-all duration-300 shadow-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative z-50 lg:z-auto top-0 left-0`}>
        <div className={`${isCollapsed ? 'p-2' : 'p-6'} h-full flex flex-col relative`}>
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1, rotate: isCollapsed ? 5 : -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-3 top-6 bg-gradient-to-r from-accent to-yellow-400 border-2 border-background rounded-full p-1.5 hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 z-10 shadow-xl"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-background" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-background" />
              )}
            </motion.div>
          </motion.button>

          {/* Logo */}
          <div className="mb-8 relative">
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-lg">G</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent">
                    GymBee
                  </h1>
                  <p className="text-xs text-text-muted">Fitness Network</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                <span className="text-black font-bold text-lg">G</span>
              </div>
            )}
            
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400/30 rounded-full animate-pulse delay-1000"></div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  title={isCollapsed ? item.label : ''}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-4 py-4'} rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-accent/20 to-yellow-400/20 text-accent shadow-lg border border-accent/30'
                      : 'text-text-muted hover:text-foreground hover:bg-gradient-to-r hover:from-card-bg/50 hover:to-card-bg/30 hover:shadow-md'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-yellow-400 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative ${isActive ? 'text-accent' : 'text-current group-hover:text-accent transition-colors'}`}>
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-lg blur-sm"></div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <span className="font-medium text-base relative z-10">{item.label}</span>
                  )}
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className={`mt-auto border-t border-border/50 ${isCollapsed ? 'pt-2' : 'pt-6'} relative`}>
            <motion.button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl hover:bg-gradient-to-r hover:from-card-bg/50 hover:to-card-bg/30 transition-all duration-200 cursor-pointer relative overflow-hidden group`}
            >
              <AvatarWithInitials 
                name={user?.fullName || 'Usuário'}
                size={isCollapsed ? 'md' : 'lg'}
                showOnlineStatus={true}
                className="relative"
              />
              
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left relative z-10">
                    <p className="font-medium text-foreground group-hover:text-accent transition-colors">{user?.fullName}</p>
                    <p className="text-sm text-text-muted">@{user?.username}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: showUserDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </motion.div>
                </>
              )}
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserDropdown && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push('/profile');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-accent/10 hover:to-yellow-400/10 transition-all duration-200 group"
                  >
                    <AvatarWithInitials 
                      name={user?.fullName || 'Usuário'}
                      size="md"
                      className="group-hover:scale-110 transition-all duration-200"
                    />
                    <span className="text-foreground group-hover:text-accent transition-colors font-medium">Ver Perfil</span>
                  </motion.button>
                  
                  <div className="border-t border-border/30"></div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleLogout();
                      setShowUserDropdown(false);
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-400/10 transition-all duration-200 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500/20 to-red-400/20 rounded-lg flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-400/30 transition-all duration-200">
                      <LogOut className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="font-medium">{isLoggingOut ? 'Deslogando...' : 'Sair'}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
