'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Handshake, MapPin, BookOpen, Smartphone, Zap, Shield, Clock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Gerenciador de Treinos",
      description: "Calendário semanal interativo com criação de treinos personalizados e acompanhamento de progresso.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Personal Trainers",
      description: "Encontre e contrate personal trainers qualificados com perfis detalhados e sistema de agendamento.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Handshake,
      title: "Duplas de Treino",
      description: "Conecte-se com pessoas próximas para treinar juntos baseado em localização e horários.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Academias Próximas",
      description: "Descubra academias na sua região com informações de horários, distância e avaliações.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Conteúdo Educativo",
      description: "Acesse artigos, dicas e conteúdo especializado sobre fitness, alimentação e saúde mental.",
      color: "from-indigo-500 to-purple-500"
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

        {/* Grid de Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative bg-card-bg border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Icon */}
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-r from-card-bg to-card-bg/50 border border-border rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Por que escolher a GymBee?
            </h3>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Tecnologia que entende suas necessidades e conecta você às melhores oportunidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">
                Match Inteligente
              </h4>
              <p className="text-text-muted">
                Algoritmo que conecta duplas baseado em proximidade, horário e nível de treino
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl mb-6">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">
                Geolocalização Precisa
              </h4>
              <p className="text-text-muted">
                Encontre academias e duplas em um raio de até 2km da sua localização
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl mb-6">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">
                Organização Completa
              </h4>
              <p className="text-text-muted">
                Calendário semanal, treinos personalizados e acompanhamento de progresso
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
