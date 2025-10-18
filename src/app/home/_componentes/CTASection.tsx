'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Shield, Clock, Star, Target, Zap as Lightning } from 'lucide-react';

export function CTASection() {
  const benefits = [
    { icon: CheckCircle, text: "100% gratuito", color: "text-green-500" },
    { icon: Shield, text: "Dados seguros", color: "text-blue-500" },
    { icon: Clock, text: "Acesso instantâneo", color: "text-purple-500" },
    { icon: Zap, text: "Algoritmo proprietário", color: "text-yellow-500" }
  ];


  return (
    <section id="cta" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-card-bg/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl"></div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4" />
            Comece sua jornada hoje
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              Comece hoje e veja
              <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent">
                a diferença!
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-text-muted mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              <span className="hidden sm:inline">
                Conecte-se, treine melhor e alcance seus objetivos. 
                <br />
                <span className="text-accent font-semibold">Cadastre-se gratuitamente</span> e descubra uma nova forma de treinar.
              </span>
              <span className="sm:hidden">
                <span className="text-accent font-semibold">Cadastre-se gratuitamente</span> e descubra uma nova forma de treinar.
              </span>
            </p>
          </motion.div>


          {/* Benefits */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-3 bg-gradient-to-r from-card-bg/40 to-card-bg/20 border border-border/30 rounded-2xl p-4 hover:border-accent/50 transition-all duration-300"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <benefit.icon className={`w-5 h-5 ${benefit.color} flex-shrink-0`} />
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="flex justify-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="group bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold py-4 sm:py-5 lg:py-6 px-8 sm:px-10 lg:px-12 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 shadow-2xl hover:shadow-accent/25 text-base sm:text-lg lg:text-xl"
              >
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Começar Grátis Agora</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-6">
              <div className="flex items-center gap-2 text-text-muted">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">10.000+ usuários ativos</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">500+ duplas formadas</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">50+ academias parceiras</span>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 text-accent">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-2 text-sm font-medium">4.8/5 (1.247 avaliações)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
