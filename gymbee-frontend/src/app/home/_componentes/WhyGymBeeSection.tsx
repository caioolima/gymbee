'use client';

import { motion } from 'framer-motion';
import { Target, Users, MapPin, Calendar, Zap, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';

export function WhyGymBeeSection() {
  const differentiators = [
    {
      icon: Target,
      title: "Única no Brasil",
      description: "Primeira plataforma especializada em duplas de treino.",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-400/20 to-cyan-400/20",
      benefits: ["Pioneira no mercado", "Especialização fitness", "Comunidade exclusiva"]
    },
    {
      icon: MapPin,
      title: "Mesma Rede de Academia",
      description: "Conecta apenas pessoas da mesma rede para treinos práticos.",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-400/20 to-emerald-400/20",
      benefits: ["Mesma academia", "Horários compatíveis", "Treinos viáveis"]
    },
    {
      icon: Users,
      title: "Algoritmo Proprietário",
      description: "Tecnologia desenvolvida especificamente para matching fitness.",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-400/20 to-pink-400/20",
      benefits: ["IA especializada", "Compatibilidade alta", "Resultados comprovados"]
    },
    {
      icon: Calendar,
      title: "Gratuito + Premium",
      description: "Plataforma gratuita com funcionalidades premium para quem quer mais.",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-400/20 to-red-400/20",
      benefits: ["100% gratuito", "Recursos extras", "Sua escolha"]
    }
  ];


  return (
    <section id="why-gymbee" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-card-bg/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-yellow-300/5 to-accent/5 rounded-full blur-3xl"></div>
      
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
            Por que escolher a GymBee?
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Por que milhares escolhem
            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
              a GymBee?
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            Conecte-se com pessoas da sua rede de academia, acesse sessões profissionais, desafios diários e artigos de dieta. 
            <span className="text-accent font-semibold"> Treinos práticos</span> e 
            <span className="text-accent font-semibold"> resultados reais</span> são nossa especialidade. 
            Comece gratuitamente e descubra uma nova forma de treinar.
          </p>
        </motion.div>

        {/* Diferenciais com layout moderno */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-16 sm:mb-20">
          {differentiators.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gradient-to-br from-card-bg/80 to-card-bg/40 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-3 group h-full">
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <motion.div 
                    className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl mb-6 shadow-2xl shadow-accent/20`}
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                    {item.description}
                  </p>
                  
                  {/* Benefits list */}
                  <div className="space-y-2">
                    {item.benefits.map((benefit, benefitIndex) => (
                      <motion.div 
                        key={benefitIndex}
                        className="flex items-center gap-2 text-sm text-text-muted"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (benefitIndex * 0.1) }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action modernizado */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-5xl mx-auto p-8 sm:p-12 bg-gradient-to-br from-card-bg/60 to-card-bg/30 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl shadow-accent/10">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5 rounded-3xl"></div>
            <div className="absolute top-6 left-6 w-4 h-4 bg-accent/30 rounded-full"></div>
            <div className="absolute bottom-6 right-6 w-3 h-3 bg-yellow-300/30 rounded-full"></div>
            <div className="absolute top-1/2 left-6 w-2 h-2 bg-accent/20 rounded-full"></div>
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Pronto para uma 
                <span className="bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent"> transformação</span>?
              </h3>
              <p className="text-lg sm:text-xl text-text-muted mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                Comece gratuitamente e descubra como milhares transformaram seus treinos. 
                Acesso completo a matching, sessões, desafios e artigos de dieta.
              </p>
              
              <div className="flex justify-center">
                <motion.a 
                  href="/register"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-accent to-yellow-300 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5" />
                  <span>Começar Grátis Agora</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
