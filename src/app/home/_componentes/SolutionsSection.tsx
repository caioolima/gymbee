'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, TrendingDown, AlertCircle, Calendar, Handshake, Smartphone, Zap, Star, ArrowRight } from 'lucide-react';

export function SolutionsSection() {
  const problems = [
    {
      icon: Users,
      title: "Treina sozinho e perde motivação",
      description: "Treinar sozinho pode ser desmotivante. Você falta treinos importantes e não tem quem te incentive nos dias difíceis.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Não encontra pessoas para treinar",
      description: "Você quer treinar com alguém, mas não sabe onde encontrar pessoas com objetivos similares. Falta uma comunidade que te motive e incentive.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Treinos desorganizados",
      description: "Você treina, mas sem organização adequada. Não tem um cronograma semanal, não acompanha progresso e pode estar treinando de forma ineficiente.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingDown,
      title: "Falta acompanhamento profissional",
      description: "Você precisa de orientação para evoluir, mas não sabe onde encontrar personal trainers confiáveis e com preços acessíveis.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Matching por Academia",
      description: "Encontre pessoas da sua rede de academia que treinam nos mesmos horários.",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-400/10 to-cyan-400/10",
      stats: "Mesma Rede"
    },
    {
      icon: Users,
      title: "Sessões com Profissionais",
      description: "Agende consultas com personal trainers verificados e nutricionistas especializados.",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-400/10 to-pink-400/10",
      stats: "Profissionais Certificados"
    },
    {
      icon: Handshake,
      title: "Desafios Diários",
      description: "Missões personalizadas que mantêm você motivado e focado nos seus objetivos.",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-400/10 to-emerald-400/10",
      stats: "Motivação Constante"
    },
    {
      icon: Smartphone,
      title: "Artigos de Dieta",
      description: "Conteúdo exclusivo sobre nutrição, receitas saudáveis e dicas de alimentação.",
      color: "from-teal-500 to-blue-500",
      gradient: "from-teal-400/10 to-blue-400/10",
      stats: "Conteúdo Exclusivo"
    }
  ];

  return (
    <>
      {/* Problems Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-orange-500/5"></div>
        
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-red-500 text-sm font-medium mb-6">
              <AlertCircle className="w-4 h-4" />
              Problemas Reais
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Você enfrenta esses
              <span className="block text-yellow-400">
                desafios?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed font-medium">
              Treinar sozinho, sem motivação e sem orientação adequada são barreiras reais que limitam seus resultados.
            </p>
          </div>

          {/* Problems Grid */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {problems.map((problem, index) => {
              const IconComponent = problem.icon;
              return (
                <motion.div
                  key={index}
                  className={`group relative bg-card-bg border border-red-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 ${index >= 2 ? 'hidden sm:block' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    {/* Icon */}
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${problem.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-red-500 transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-base sm:text-lg text-text-muted leading-relaxed font-medium">
                      {problem.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>


          {/* Solutions Header */}
          <motion.div 
            className="text-center mb-16 sm:mb-20 lg:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium mb-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Star className="w-4 h-4" />
              Nossas Soluções
            </motion.div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              Tecnologia que
              <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
                funciona de verdade
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-text-muted max-w-4xl mx-auto leading-relaxed font-medium">
              Algoritmo proprietário, matching inteligente por rede de academia, sessões com profissionais verificados e conteúdo especializado.
            </p>
          </motion.div>

          {/* Grid de Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-16 sm:mb-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`group relative ${index >= 2 ? 'hidden sm:block' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative bg-gradient-to-br from-card-bg/80 to-card-bg/40 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-4 group h-full">
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Stats badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-accent to-yellow-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {feature.stats}
                      </div>
                    </div>
                    
                    <div className="relative h-full flex flex-col">
                      {/* Icon with enhanced styling */}
                      <motion.div 
                        className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl mb-6 shadow-2xl shadow-accent/20`}
                        whileHover={{ rotate: 10, scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                      
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-base sm:text-lg text-text-muted leading-relaxed flex-1 mb-6 font-medium">
                        {feature.description}
                      </p>
                      
                      {/* Learn more link */}
                      <motion.div 
                        className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span>Saiba mais</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/register" className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-8 py-4 text-accent font-semibold hover:bg-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer">
              <Zap className="w-5 h-5" />
              <span>Explore todas as funcionalidades</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  );
}
