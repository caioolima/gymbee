'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Download, Zap, Star, Target, Flame, Dumbbell, User, UserCheck, Heart, Apple } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeroSection() {
  const { isInstallable, isInstalled, installPWA, isIOS } = usePWAInstall();
  const shouldReduceMotion = useReducedMotion();

  // Animações otimizadas para mobile
  const fadeIn = shouldReduceMotion 
    ? { opacity: 1 } 
    : { opacity: 0, y: 30 };
  
  const fadeInLeft = shouldReduceMotion 
    ? { opacity: 1, x: 0 } 
    : { opacity: 0, x: -50 };

  const animateProps = shouldReduceMotion 
    ? { opacity: 1, y: 0, x: 0 }
    : { opacity: 1, y: 0, x: 0 };

  const transitionProps = shouldReduceMotion 
    ? { duration: 0.1 }
    : { duration: 0.8, ease: "easeOut" as const };

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-background via-card-bg/20 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-300/5 to-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Conteúdo Principal */}
          <motion.div 
            className="space-y-8 sm:space-y-10 lg:space-y-12"
            initial={fadeInLeft}
            animate={animateProps}
            transition={transitionProps}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium shadow-lg"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={animateProps}
              transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.6, delay: 0.1 }}
            >
              <Zap className="w-4 h-4" />
              Primeira solução brasileira
            </motion.div>

            <motion.div 
              className="space-y-8"
              initial={fadeIn}
              animate={animateProps}
              transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                animate={animateProps}
                transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 1, delay: 0.3 }}
              >
                <motion.span 
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={animateProps}
                  transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.3 }}
                >
                  Treine melhor.
                </motion.span>
                <br></br>
                <motion.span 

                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={animateProps}
                  transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.6 }}
                >
                  Conecte-se.
                </motion.span>
                <br></br>
                <motion.span 
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={animateProps}
                  transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.8 }}
                >
                  Evolua.
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl font-medium"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                animate={animateProps}
                transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.8 }}
              >
                A primeira solução brasileira que conecta pessoas da mesma academia para treinar juntas. Pare de treinar sozinho e acelere seus resultados.
              </motion.p>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={animateProps}
              transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 shadow-2xl hover:shadow-accent/25 text-base sm:text-lg"
                >
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  Começar Grátis Agora
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.button 
                onClick={installPWA}
                disabled={!isInstallable || isInstalled}
                className={`group cursor-pointer bg-transparent hover:bg-card-bg/50 text-foreground border-2 border-border hover:border-accent font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 text-base sm:text-lg lg:hidden ${
                  !isInstallable || isInstalled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={shouldReduceMotion ? {} : { scale: isInstallable && !isInstalled ? 1.05 : 1 }}
                whileTap={shouldReduceMotion ? {} : { scale: isInstallable && !isInstalled ? 0.95 : 1 }}
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                {isInstalled ? 'App Instalado' : isIOS ? 'Instalar App' : isInstallable ? 'Baixar App' : 'Baixar App'}
              </motion.button>
            </motion.div>

            {/* Stats rápidas */}
            <motion.div 
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-4"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={animateProps}
              transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm text-text-muted">Usuários ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">2km</div>
                <div className="text-sm text-text-muted">Raio de busca</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">95%</div>
                <div className="text-sm text-text-muted">Satisfação</div>
              </div>
            </motion.div>

          </motion.div>

          {/* Visual Principal - Mockup Simples */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Mockup Simples */}
            <motion.div 
              className="relative bg-gradient-to-br from-background via-card-bg/20 to-background rounded-2xl p-2 sm:p-4 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              whileHover={{ scale: 1.02, rotateY: -2 }}
            >
              {/* Conteúdo Principal */}
              <div className="space-y-3 sm:space-y-6">
                {/* Header com Saudação */}
                <div className="flex items-start justify-between mb-3 sm:mb-6">
                  <div>
                    <h3 className="text-foreground font-bold text-base sm:text-lg mb-1">Início</h3>
                    <p className="text-accent text-xs sm:text-sm font-medium">
                      {new Date().toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-300 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-black font-bold text-base">M</span>
                  </motion.div>
                </div>

                 {/* Dashboard Integrado */}
                 <motion.div 
                   className="bg-gradient-to-br from-card-bg/50 to-card-bg/30 border border-border rounded-md p-1.5 sm:p-2 shadow-lg"
                   whileHover={{ scale: 1.01, y: -1 }}
                   transition={{ duration: 0.2 }}
                 >
                   {/* Treino de Hoje */}
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-1.5">
                       <motion.div
                         animate={{ rotate: [0, 10, -10, 0] }}
                         transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                       >
                         <Calendar className="w-3 h-3 text-emerald-400" />
                       </motion.div>
                       <div>
                         <h4 className="text-foreground font-bold text-xs">Treino de Hoje</h4>
                         <p className="text-emerald-400 text-xs">Peito e Tríceps • 3/8</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-emerald-300 text-xs font-medium">45min</div>
                       <div className="w-10 bg-emerald-500/30 rounded-full h-1 overflow-hidden mt-0.5">
                         <motion.div 
                           className="bg-gradient-to-r from-emerald-400 to-green-300 h-1 rounded-full"
                           initial={{ width: "0%" }}
                           animate={{ width: "37.5%" }}
                           transition={{ duration: 2, delay: 1 }}
                         ></motion.div>
                       </div>
                     </div>
                   </div>

                   {/* Sessão Agendada */}
                   <div className="flex items-center justify-between mb-2 p-1.5 bg-blue-500/10 rounded border border-blue-500/20">
                     <div className="flex items-center gap-1.5">
                       <motion.div
                         animate={{ 
                           scale: [1, 1.1, 1],
                           rotate: [0, 5, -5, 0]
                         }}
                         transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                       >
                         <Star className="w-3 h-3 text-blue-500" />
                       </motion.div>
                       <div>
                         <h4 className="text-foreground font-bold text-xs">Sessão com Carlos Silva</h4>
                         <p className="text-blue-400 text-xs">Amanhã 14h • 4.9★</p>
                       </div>
                     </div>
                     <div className="text-emerald-400 text-xs font-medium flex items-center gap-0.5">
                       <UserCheck className="w-2.5 h-2.5" /> Confirmado
                     </div>
                   </div>

                   {/* Desafio Diário */}
                   <div className="flex items-center justify-between p-1.5 bg-orange-500/10 rounded border border-orange-500/20">
                     <div className="flex items-center gap-1.5">
                       <motion.div
                         animate={{ 
                           scale: [1, 1.1, 1],
                           rotate: [0, 5, -5, 0]
                         }}
                         transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                       >
                         <Target className="w-3 h-3 text-orange-400" />
                       </motion.div>
                       <div>
                         <h4 className="text-foreground font-bold text-xs">Desafio Diário</h4>
                         <p className="text-orange-400 text-xs">50 Flexões • Desafio disponível</p>
                       </div>
                     </div>
                     <motion.div 
                       className="text-black text-xs font-bold bg-gradient-to-r from-orange-400 to-red-300 px-2 py-0.5 rounded-full shadow-lg"
                       animate={{ 
                         backgroundColor: ["rgba(251, 146, 60, 0.8)", "rgba(251, 146, 60, 1)", "rgba(251, 146, 60, 0.8)"],
                         scale: [1, 1.03, 1]
                       }}
                       transition={{ duration: 2, repeat: Infinity }}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <Flame className="w-2.5 h-2.5 inline mr-0.5" /> Participar
                     </motion.div>
                   </div>
                 </motion.div>

                 {/* Artigos - Seção Profissional */}
                 <div className="mb-6 hidden sm:block">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-foreground font-semibold text-base">Artigos</h4>
                     <span className="text-accent text-sm font-medium">Ver todos</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                     {/* Artigo 1 */}
                     <motion.div 
                       className="bg-card-bg/30 border border-border/30 rounded-lg p-2 cursor-pointer"
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="w-full h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-md mb-1 flex items-center justify-center">
                         <Dumbbell className="w-6 h-6 text-white" />
                       </div>
                       <h5 className="text-foreground font-semibold text-xs mb-1">Treino HIIT</h5>
                       <div className="flex items-center gap-1">
                         <span className="text-accent text-xs font-medium">Fitness</span>
                         <span className="text-muted-foreground text-xs">•</span>
                         <span className="text-muted-foreground text-xs">5 min</span>
                       </div>
                     </motion.div>

                     {/* Artigo 2 */}
                     <motion.div 
                       className="bg-card-bg/30 border border-border/30 rounded-lg p-2 cursor-pointer"
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="w-full h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-md mb-1 flex items-center justify-center">
                         <Apple className="w-6 h-6 text-white" />
                       </div>
                       <h5 className="text-foreground font-semibold text-xs mb-1">Alimentação</h5>
                       <div className="flex items-center gap-1">
                         <span className="text-emerald-500 text-xs font-medium">Nutrição</span>
                         <span className="text-muted-foreground text-xs">•</span>
                         <span className="text-muted-foreground text-xs">3 min</span>
                       </div>
                     </motion.div>

                     {/* Artigo 3 */}
                     <motion.div 
                       className="bg-card-bg/30 border border-border/30 rounded-lg p-2 cursor-pointer"
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="w-full h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md mb-1 flex items-center justify-center">
                         <Users className="w-6 h-6 text-white" />
                       </div>
                       <h5 className="text-foreground font-semibold text-xs mb-1">Duplas</h5>
                       <div className="flex items-center gap-1">
                         <span className="text-blue-500 text-xs font-medium">Comunidade</span>
                         <span className="text-muted-foreground text-xs">•</span>
                         <span className="text-muted-foreground text-xs">4 min</span>
                       </div>
                     </motion.div>

                     {/* Artigo 4 */}
                     <motion.div 
                       className="bg-card-bg/30 border border-border/30 rounded-lg p-2 cursor-pointer"
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 0.2 }}
                     >
                       <div className="w-full h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md mb-1 flex items-center justify-center">
                         <Target className="w-6 h-6 text-white" />
                       </div>
                       <h5 className="text-foreground font-semibold text-xs mb-1">Motivação</h5>
                       <div className="flex items-center gap-1">
                         <span className="text-purple-500 text-xs font-medium">Mindset</span>
                         <span className="text-muted-foreground text-xs">•</span>
                         <span className="text-muted-foreground text-xs">6 min</span>
                       </div>
                     </motion.div>
                   </div>
                 </div>

                {/* Sugestões de Duplas */}
                <motion.div 
                  className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-3 shadow-lg mb-6 hidden sm:block"
                  whileHover={{ scale: 1.01, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                   <div className="flex items-center gap-2 mb-3">
                     <motion.div
                       animate={{ 
                         scale: [1, 1.1, 1],
                         rotate: [0, 3, -3, 0]
                       }}
                       transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                     >
                       <Users className="w-5 h-5 text-yellow-500" />
                     </motion.div>
                     <span className="text-foreground font-semibold text-xs">Sugestões de Duplas</span>
                   </div>
                  
                  <div className="space-y-2">
                    {/* Sugestão 1 */}
                    <motion.div 
                      className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
                      >
                        <span className="text-black font-semibold text-xs">A</span>
                      </motion.div>
                       <div className="flex-1">
                         <div className="text-foreground font-bold text-xs flex items-center gap-1">
                           <User className="w-4 h-4 text-yellow-500" /> 
                           Ana, 28
                         </div>
                         <div className="text-yellow-600 text-xs font-medium">Smart Fit • Mesma unidade</div>
                       </div>
                      <div className="flex gap-1">
                        <motion.button 
                          className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-black text-xs font-bold">✕</span>
                        </motion.button>
                        <motion.button 
                          className="w-6 h-6 bg-gradient-to-br from-accent to-yellow-300 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{ 
                            backgroundColor: ["rgba(254, 205, 0, 0.6)", "rgba(254, 205, 0, 0.8)", "rgba(254, 205, 0, 0.6)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="w-4 h-4 text-black fill-current" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Sugestão 2 */}
                    <motion.div 
                      className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, -2, 2, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <span className="text-black font-semibold text-xs">C</span>
                      </motion.div>
                       <div className="flex-1">
                         <div className="text-foreground font-bold text-xs flex items-center gap-1">
                           <User className="w-4 h-4 text-amber-500" /> 
                           Carlos, 32
                         </div>
                         <div className="text-amber-600 text-xs font-medium">Smart Fit • Mesma unidade</div>
                       </div>
                      <div className="flex gap-1">
                        <motion.button 
                          className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-black text-xs font-bold">✕</span>
                        </motion.button>
                        <motion.button 
                          className="w-6 h-6 bg-gradient-to-br from-accent to-yellow-300 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{ 
                            backgroundColor: ["rgba(254, 205, 0, 0.6)", "rgba(254, 205, 0, 0.8)", "rgba(254, 205, 0, 0.6)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <Heart className="w-4 h-4 text-black fill-current" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Bottom Navigation */}
                <div className="mt-4 flex justify-around py-3 border-t border-border">
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                       <Target className="w-4 h-4 text-black" />
                     </div>
                     <span className="text-accent text-xs font-medium">Início</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                       <Dumbbell className="w-4 h-4 text-muted-foreground" />
                     </div>
                     <span className="text-muted-foreground text-xs">Fitness</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                       <Users className="w-4 h-4 text-muted-foreground" />
                     </div>
                     <span className="text-muted-foreground text-xs">Duplas</span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-300/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}