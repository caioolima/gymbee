'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Handshake, MapPin, Smartphone, Zap, Star, ArrowRight } from 'lucide-react';

export function FeaturesSection() {
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
    <section id="features" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-card-bg/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-accent/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-yellow-300/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Funcionalidades Avançadas
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Plataforma inteligente para
            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
              resultados reais
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            Conecte-se com pessoas da sua academia, acesse sessões profissionais, desafios diários 
            e artigos de dieta. Tudo para maximizar seus resultados na mesma rede.
          </p>
        </motion.div>

        {/* Grid de Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-16 sm:mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative"
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
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-text-muted leading-relaxed flex-1 mb-6">
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-8 py-4 text-accent font-semibold hover:bg-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer">
            <Zap className="w-5 h-5" />
            <span>Explore todas as funcionalidades</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
