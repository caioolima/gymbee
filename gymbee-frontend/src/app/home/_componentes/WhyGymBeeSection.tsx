'use client';

import { motion } from 'framer-motion';
import { Target, Users, MapPin, Calendar, Zap, Shield, TrendingUp } from 'lucide-react';

export function WhyGymBeeSection() {
  const differentiators = [
    {
      icon: Target,
      title: "Tudo em Um",
      description: "Duplas + Personal + Academias + Treinos",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Próximo de Você",
      description: "Academias e duplas até 2km",
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

  const benefits = [
    {
      icon: Zap,
      title: "Para Praticantes",
      description: "Organize treinos, encontre duplas e evolua mais rápido"
    },
    {
      icon: Users,
      title: "Para Personal Trainers",
      description: "Ganhe mais clientes e gerencie sua agenda facilmente"
    },
    {
      icon: TrendingUp,
      title: "Para Academias",
      description: "Conecte-se com novos alunos e aumente sua visibilidade"
    }
  ];

  return (
    <section id="why-gymbee" className="py-24 bg-gradient-to-br from-background via-card-bg/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium mb-8 shadow-lg shadow-accent/10">
            <Target className="w-4 h-4" />
            Por que escolher a GymBee?
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Por que a GymBee
            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
              é diferente?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            Outros apps são só calendários. A GymBee é sua 
            <span className="text-accent font-semibold"> rede social fitness</span> que conecta 
            pessoas reais com objetivos similares. Aqui você não treina sozinho - 
            você faz parte de uma comunidade que te empurra para o próximo nível.
          </p>
        </motion.div>

        {/* Diferenciais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-full p-6 bg-card-bg/50 border border-border/50 rounded-2xl hover:border-accent/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/10 group-hover:-translate-y-1 flex flex-col">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed flex-1">
                    {item.description}
                  </p>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefícios por tipo de usuário */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Para todo mundo
          </h3>
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-16">
            Praticantes, personal trainers e academias
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={benefit.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative h-full p-8 bg-gradient-to-br from-card-bg/30 to-card-bg/10 border border-border/30 rounded-3xl hover:border-accent/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/10 group-hover:-translate-y-2 flex flex-col">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-3xl mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                    <benefit.icon className="w-10 h-10 text-accent group-hover:text-accent/90" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                      {benefit.title}
                    </h4>
                    <p className="text-text-muted leading-relaxed flex-1">
                      {benefit.description}
                    </p>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-4xl mx-auto p-8 bg-gradient-to-br from-card-bg/40 to-card-bg/20 border border-border/30 rounded-3xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl"></div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-accent/30 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent/20 rounded-full"></div>
            
            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Pronto para treinar com mais motivação?
              </h3>
              <p className="text-lg text-text-muted mb-6 max-w-2xl mx-auto">
                Junte-se à comunidade que está revolucionando o fitness. 
                Conecte-se com pessoas reais e acelere sua evolução.
              </p>
              <a 
                href="/register"
                className="inline-flex items-center gap-3 text-accent font-semibold bg-accent/10 border border-accent/20 rounded-full px-6 py-3 hover:bg-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer"
              >
                <Shield className="w-5 h-5" />
                Comece sua jornada hoje mesmo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
