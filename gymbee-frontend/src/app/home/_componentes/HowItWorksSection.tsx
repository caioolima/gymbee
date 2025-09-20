'use client';

import { motion } from 'framer-motion';
import { UserPlus, Calendar, Users, MapPin, CheckCircle } from 'lucide-react';
import { FlyingBee } from './FlyingBee';

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Crie sua conta",
      description: "Cadastre-se gratuitamente em poucos segundos",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      icon: Calendar,
      title: "Organize seus treinos",
      description: "Configure seu calendário de treinos personalizado",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      icon: Users,
      title: "Encontre duplas",
      description: "Conecte-se com pessoas próximas para treinar juntos",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      icon: MapPin,
      title: "Conecte-se",
      description: "Encontre personal trainers e duplas próximas",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-background via-card-bg/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      {/* Abelha Voando */}
      <FlyingBee />
      
      <div className="relative max-w-[1600px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Como Funciona
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Em 4 passos simples,
            <span className="block bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              você está conectado!
            </span>
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Simples assim: cadastre-se, defina seus objetivos, encontre parceiros de treino 
            e comece a evoluir junto com pessoas que realmente se importam com seus resultados.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 sm:space-y-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
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
                {/* Step Number and Icon */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
