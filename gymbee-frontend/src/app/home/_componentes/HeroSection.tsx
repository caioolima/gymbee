'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MapPin, Calendar, Download } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Conteúdo Principal */}
          <motion.div 
            className="space-y-6 sm:space-y-8 lg:space-y-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Treine com duplas,
                <motion.span 
                  className="block bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  encontre personal trainers
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Pare de treinar sozinho e comece a evoluir de verdade. 
                <strong> Conecte-se com pessoas que compartilham seus objetivos e transforme cada treino em uma experiência motivadora.</strong>
              </motion.p>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
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
                  className="group bg-accent hover:bg-accent/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/25 text-sm sm:text-base"
                >
                  Começar a Treinar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.button 
                className="group cursor-pointer bg-transparent hover:bg-card-bg text-foreground border-2 border-border hover:border-accent font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Baixar App
              </motion.button>
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
              className="relative bg-card-bg border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              whileHover={{ scale: 1.02, rotateY: -2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-text-muted font-medium">GymBee Dashboard</div>
              </div>

              {/* Preview das Funcionalidades */}
              <div className="bg-gradient-to-r from-accent to-yellow-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Seu Treino</span>
                </div>
                <div className="text-white text-base sm:text-lg font-bold mb-1">Conecte-se e evolua</div>
                <div className="text-white/80 text-xs sm:text-sm">Calendário personalizado</div>
              </div>

              {/* Cards de Funcionalidades */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-input-bg border border-border rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
                  <div className="text-foreground font-semibold text-xs sm:text-sm mb-1">Duplas</div>
                  <div className="text-text-muted text-xs">Encontre parceiros</div>
                </div>
                <div className="bg-input-bg border border-border rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
                  <div className="text-foreground font-semibold text-xs sm:text-sm mb-1">Localização</div>
                  <div className="text-text-muted text-xs">Encontre pessoas próximas</div>
                </div>
              </div>

              {/* Preview de Personal Trainers */}
              <div className="space-y-2 sm:space-y-3">
                <div className="text-foreground font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Personal Trainers</div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-input-bg border border-border rounded-lg sm:rounded-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground font-medium text-xs sm:text-sm">Encontre profissionais</div>
                    <div className="text-text-muted text-xs">Qualificados e próximos</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-input-bg border border-border rounded-lg sm:rounded-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground font-medium text-xs sm:text-sm">Agende facilmente</div>
                    <div className="text-text-muted text-xs">Sistema integrado</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
