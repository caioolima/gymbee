'use client';

import { motion } from 'framer-motion';
import { UserPlus, Calendar, Users, MapPin, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { FlyingBee } from './FlyingBee';

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Cadastro Rápido",
      description: "Preencha seu perfil em menos de 2 minutos",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-400/20 to-cyan-400/20"
    },
    {
      number: "02", 
      icon: Calendar,
      title: "Configure Preferências",
      description: "Defina horários, localização e tipo de treino",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-400/20 to-pink-400/20"
    },
    {
      number: "03",
      icon: Users,
      title: "Receba Matches",
      description: "Nosso algoritmo encontra pessoas compatíveis",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-400/20 to-emerald-400/20"
    },
    {
      number: "04",
      icon: MapPin,
      title: "Confirme Encontro",
      description: "Aceite ou recuse sugestões em tempo real",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-400/20 to-red-400/20"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-background via-card-bg/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-accent/5 to-yellow-300/5 rounded-full blur-3xl"></div>
      
      {/* Abelha Voando */}
      <FlyingBee />
      
      <div className="relative max-w-[1600px] mx-auto px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
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
            <Sparkles className="w-4 h-4" />
            Como Funciona
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Como funciona a
            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
              plataforma GymBee?
            </span>
          </h2>
          <p className="text-xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            Nossa tecnologia inteligente conecta você automaticamente com pessoas compatíveis. 
            Veja como é simples começar a treinar com a dupla perfeita.
          </p>
        </motion.div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Connecting arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-accent/40" />
                    </div>
                  )}
                  
                  <div className="relative bg-gradient-to-br from-card-bg/80 to-card-bg/40 backdrop-blur-sm border border-border/50 rounded-3xl p-8 text-center hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-3 group">
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Step Number with glow effect */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-300 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-2xl shadow-accent/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.number}
                      </motion.div>
                    </div>

                    {/* Icon with enhanced animation */}
                    <motion.div 
                      className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl mb-6 shadow-2xl shadow-accent/20`}
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                      {/* Sparkle effect */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-white/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-base text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
