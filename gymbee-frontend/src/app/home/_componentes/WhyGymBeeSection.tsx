'use client';

import { motion } from 'framer-motion';
import { Target, Users, MapPin, Calendar, Zap, Shield } from 'lucide-react';

export function WhyGymBeeSection() {
  const differentiators = [
    {
      icon: Target,
      title: "Tudo em Um",
      description: "Duplas + Personal + Treinos",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Próximo de Você",
      description: "Duplas e personal trainers até 2km",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Match Perfeito",
      description: "Algoritmo que encontra sua dupla ideal",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Organize Tudo",
      description: "Calendário + Treinos + Progresso",
      color: "from-orange-500 to-red-500"
    }
  ];


  return (
    <section id="why-gymbee" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-background via-card-bg/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-accent text-sm font-medium mb-6 sm:mb-8 shadow-lg shadow-accent/10">
            <Target className="w-4 h-4" />
            Por que escolher a GymBee?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Por que a GymBee
            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
              é diferente?
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            A GymBee conecta você com 
            <span className="text-accent font-semibold"> duplas de treino</span> e 
            <span className="text-accent font-semibold"> personal trainers</span> próximos. 
            Pare de treinar sozinho e acelere seus resultados com pessoas que compartilham seus objetivos.
          </p>
        </motion.div>

        {/* Diferenciais */}
        <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${item.color} rounded-3xl mb-6 shadow-lg`}>
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

  

        {/* Call to action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-card-bg/40 to-card-bg/20 border border-border/30 rounded-2xl sm:rounded-3xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl"></div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-accent/30 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent/20 rounded-full"></div>
            
            <div className="relative">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Pronto para treinar com mais motivação?
              </h3>
              <p className="text-base sm:text-lg text-text-muted mb-4 sm:mb-6 max-w-2xl mx-auto">
                Transforme seus treinos em experiências motivadoras e resultados reais.
              </p>
              <a 
                href="/register"
                className="inline-flex items-center gap-2 sm:gap-3 text-accent font-semibold bg-accent/10 border border-accent/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 hover:bg-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                Comece sua jornada hoje mesmo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
