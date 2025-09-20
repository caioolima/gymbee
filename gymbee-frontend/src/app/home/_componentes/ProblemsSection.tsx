'use client';

import { motion } from 'framer-motion';
import { X, Clock, MapPin, Users, TrendingDown, AlertCircle } from 'lucide-react';

export function ProblemsSection() {
  const problems = [
    {
      icon: Users,
      title: "Treina sozinho e perde motivação",
      description: "Treinar sozinho pode ser desmotivante. Você falta treinos importantes e não tem quem te incentive nos dias difíceis.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Não encontra pessoas para treinar",
      description: "Você quer treinar com alguém, mas não sabe onde encontrar pessoas com objetivos similares. Falta uma comunidade que te motive e incentive.",
      color: "from-orange-500 to-red-500"
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
    }
  ];

  return (
    <section id="problems" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-red-500 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4" />
            Problemas Reais
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Você treina sozinho e enfrenta
            <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              esses problemas?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Esses problemas são comuns e podem estar atrapalhando seus resultados.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <motion.div
                key={index}
                className="group relative bg-card-bg border border-red-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Icon */}
                  <motion.div 
                    className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${problem.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-red-500 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Transition Message */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium mb-4">
              <X className="w-4 h-4" />
              Solução
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Pronto para revolucionar seus treinos?
            </h3>
            <p className="text-lg text-text-muted mb-6 max-w-3xl mx-auto">
              A GymBee resolve todos esses problemas em uma única plataforma.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
