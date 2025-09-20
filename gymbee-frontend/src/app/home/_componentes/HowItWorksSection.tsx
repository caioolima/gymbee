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
      title: "Descubra academias",
      description: "Encontre academias próximas e personal trainers",
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
            Simples assim: cadastre-se, defina seus objetivos, encontre sua tribo 
            e comece a evoluir junto com pessoas que realmente se importam com seus resultados.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="relative bg-card-bg border border-border rounded-2xl p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mb-6 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-text-muted mb-4">
            <strong>Pronto para começar?</strong> É rápido, fácil e gratuito!
          </p>
          <div className="inline-flex items-center gap-2 text-accent font-semibold">
            <CheckCircle className="w-5 h-5" />
            Faça parte da nossa comunidade fitness
          </div>
        </motion.div>
      </div>
    </section>
  );
}
