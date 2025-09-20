'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Handshake, MapPin, Smartphone, Zap } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Gerenciador de Treinos",
      description: "Organize seus treinos com calendário interativo e acompanhe seu progresso.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Personal Trainers",
      description: "Contrate profissionais qualificados com sistema de agendamento integrado.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Handshake,
      title: "Duplas de Treino",
      description: "Encontre parceiros de treino próximos com objetivos similares.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      description: "Funcionalidade offline, notificações push e sincronização em tempo real entre dispositivos.",
      color: "from-teal-500 to-blue-500"
    }
  ];


  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Funcionalidades Avançadas
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Tudo que você precisa para
            <span className="block bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              sua jornada fitness
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Ferramentas inteligentes que transformam sua rotina de treinos. 
            De calendários personalizados a conexões reais com profissionais qualificados.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-8 sm:space-y-12 mb-12 sm:mb-16 lg:mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {feature.description}
                  </p>
                </div>
                
                {/* Visual Element */}
                <div className="flex-1">
                  <div className={`w-full h-64 sm:h-80 bg-gradient-to-br ${feature.color} rounded-2xl opacity-20 flex items-center justify-center`}>
                    <IconComponent className="w-24 h-24 sm:w-32 sm:h-32 text-white opacity-50" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
