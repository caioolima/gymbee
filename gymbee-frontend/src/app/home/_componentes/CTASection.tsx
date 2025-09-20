'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Clock } from 'lucide-react';

export function CTASection() {
  const benefits = [
    { icon: CheckCircle, text: "Calendário de treinos" },
    { icon: Shield, text: "Personal trainers verificados" },
    { icon: Clock, text: "Treinos organizados" },
    { icon: Zap, text: "Duplas de treino" }
  ];

  return (
    <section id="cta" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium mb-6 sm:mb-8">
            <Zap className="w-4 h-4" />
            Comece sua jornada hoje
          </div>

          {/* Main Content */}
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Pronto para acelerar
            <span className="block bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">
              seus resultados?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-text-muted mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Junte-se a milhares de pessoas que já transformaram seus treinos.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <Link
              href="/register"
              className="group bg-accent hover:bg-accent/90 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 sm:gap-3 shadow-2xl hover:shadow-accent/25 text-sm sm:text-base lg:text-lg"
            >
              Organizar Meus Treinos Agora
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-2 sm:gap-3 justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground font-medium text-xs sm:text-sm">{benefit.text}</span>
                </div>
              );
            })}
          </div>


          {/* Final Message */}
          <div className="mt-8 sm:mt-12">
            <p className="text-base sm:text-lg text-text-muted mb-3 sm:mb-4">
              <strong>Comece hoje:</strong> Conecte-se com sua rede fitness em minutos
            </p>
            <div className="inline-flex items-center gap-2 text-accent font-bold text-base sm:text-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              É gratuito e funciona offline!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
