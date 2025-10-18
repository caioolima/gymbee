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
    },
    {
      icon: AlertCircle,
      title: "Não vê resultados consistentes",
      description: "Você treina regularmente, mas os resultados não aparecem como esperado. Falta orientação específica para seus objetivos.",
      color: "from-blue-500 to-cyan-500"
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
      {/* Problems Section - Layout Moderno */}
      <section id="features" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-card-bg/10 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 via-transparent to-orange-500/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-16 sm:mb-20 lg:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3 text-red-500 text-sm font-medium mb-8 shadow-lg">
              <AlertCircle className="w-4 h-4" />
              Problemas Reais
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              Você enfrenta esses
              <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                desafios?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Treinar sozinho, sem motivação e sem orientação adequada são barreiras reais que limitam seus resultados.
            </p>
          </motion.div>

          {/* Problems - Layout de Alertas */}
          <div className="max-w-7xl mx-auto mb-16 sm:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {problems.map((problem, index) => {
                const IconComponent = problem.icon;
                return (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Alerta de problema */}
                    <div className="relative p-8 rounded-2xl border-l-4 border-red-500 bg-red-50/10 hover:bg-red-50/20 transition-colors duration-300">
                      {/* Ícone de alerta */}
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${problem.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          {/* Badge de urgência */}
                          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-red-500 text-sm font-medium mb-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Problema #{index + 1}
                          </div>
                          
                          {/* Título */}
                          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-red-500 transition-colors">
                            {problem.title}
                          </h3>
                          
                          {/* Descrição */}
                          <p className="text-base text-text-muted leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Indicador de severidade */}
                      <div className="absolute top-6 right-6">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>


          {/* Solutions - Layout Simples e Elegante */}
          <div className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16 sm:mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium mb-8 shadow-lg">
                  <Star className="w-4 h-4" />
                  Nossas Soluções
                </div>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
                  Tecnologia que
                  <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
                    funciona de verdade
                  </span>
                </h2>
                <p className="text-xl sm:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed font-medium">
                  Algoritmo proprietário, matching inteligente por rede de academia, sessões com profissionais verificados e conteúdo especializado.
                </p>
              </motion.div>
              
              {/* Grid Simples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-8 rounded-2xl bg-gradient-to-br from-card-bg/50 to-card-bg/20 border border-border/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                        {/* Ícone */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium mb-4">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          {feature.stats}
                        </div>
                        
                        {/* Título */}
                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                          {feature.title}
                        </h3>
                        
                        {/* Descrição */}
                        <p className="text-lg text-text-muted leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>


        </div>
      </section>

    </>
  );
}
