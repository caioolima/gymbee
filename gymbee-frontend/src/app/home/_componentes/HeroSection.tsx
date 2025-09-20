'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MapPin, Calendar, Download, Zap, Star, Target, Shield } from 'lucide-react';

export function HeroSection() {
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
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Zap className="w-4 h-4" />
              Primeira plataforma brasileira
            </motion.div>

            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Pare de treinar
                <motion.span 
                  className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  sozinho
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl sm:text-2xl text-text-muted leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Encontre pessoas da sua academia que treinam nos mesmos horários. 
                <span className="text-accent font-semibold"> Conecte-se com quem frequenta a mesma rede e transforme seus treinos.</span>
              </motion.p>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 shadow-2xl hover:shadow-accent/25 text-base sm:text-lg"
                >
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  Começar Grátis Agora
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.button 
                className="group cursor-pointer bg-transparent hover:bg-card-bg/50 text-foreground border-2 border-border hover:border-accent font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 text-base sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                Baixar App
              </motion.button>
            </motion.div>

            {/* Stats rápidas */}
            <motion.div 
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
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

          {/* Visual Principal */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Card Principal */}
            <motion.div 
              className="relative bg-gradient-to-br from-card-bg/80 to-card-bg/40 backdrop-blur-sm border border-border/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-accent/10"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              whileHover={{ scale: 1.02, rotateY: -2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-4 py-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-accent font-semibold text-sm">GymBee</span>
                </div>
              </div>

              {/* Hero Card - Tinder Style */}
              <div className="bg-gradient-to-br from-accent to-yellow-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Mesma academia</div>
                      <div className="text-white/80 text-sm">Mesmos horários</div>
                    </div>
                  </div>
                  <div className="text-white text-2xl sm:text-3xl font-bold mb-2">Match em 7 dias</div>
                  <div className="text-white/80 text-sm">Compatibilidade 95%</div>
                  
                  {/* Tinder-style action buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-500 text-lg">✕</span>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-500 text-lg">♥</span>
                    </div>
                    <div className="text-white/60 text-xs">Deslize para escolher</div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-card-bg/60 to-card-bg/30 border border-border/50 rounded-2xl p-4 sm:p-6 hover:border-accent/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Users className="w-8 h-8 text-accent mb-3" />
                  <div className="text-foreground font-bold text-sm sm:text-base mb-1">Duplas</div>
                  <div className="text-text-muted text-xs">Pessoas próximas</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-card-bg/60 to-card-bg/30 border border-border/50 rounded-2xl p-4 sm:p-6 hover:border-accent/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <MapPin className="w-8 h-8 text-accent mb-3" />
                  <div className="text-foreground font-bold text-sm sm:text-base mb-1">2km</div>
                  <div className="text-text-muted text-xs">Raio de busca</div>
                </motion.div>
              </div>

              {/* Sugestões de Match */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-bold text-sm">Sugestões para você</span>
                </div>
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-card-bg/40 to-card-bg/20 border border-border/30 rounded-xl hover:border-accent/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-foreground font-semibold text-sm">Ana, 28 anos</div>
                      <div className="text-text-muted text-xs">Smart Fit • Mesma unidade</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-xs">✕</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-500 text-xs">♥</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-card-bg/40 to-card-bg/20 border border-border/30 rounded-xl hover:border-accent/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-foreground font-semibold text-sm">Carlos, 32 anos</div>
                      <div className="text-text-muted text-xs">Smart Fit • Mesma unidade</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-xs">✕</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-500 text-xs">♥</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
