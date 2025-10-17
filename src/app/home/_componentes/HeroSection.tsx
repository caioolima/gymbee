'use client';

import Link from 'next/link';
import { ArrowRight, Users, Calendar, Download, Zap, Star, Target, Activity } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function HeroSection() {
  const { isInstallable, isInstalled, installPWA, isIOS } = usePWAInstall();

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-background via-card-bg/20 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-300/5 to-accent/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Conteúdo Principal */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-300/10 border border-accent/20 rounded-full px-6 py-3 text-accent text-sm font-medium shadow-lg">
              <Zap className="w-4 h-4" />
              Primeira solução brasileira
            </div>

            <div className="space-y-8">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                <span>Treine melhor.</span>
                <br></br>
                <span>Conecte-se.</span>
                <br></br>
                <span>Evolua.</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl font-medium">
                A primeira solução brasileira que conecta pessoas da mesma academia para treinar juntas. Pare de treinar sozinho e acelere seus resultados.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div>
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 shadow-2xl hover:shadow-accent/25 text-base sm:text-lg"
                >
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  Começar Grátis Agora
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <button 
                onClick={installPWA}
                disabled={!isInstallable || isInstalled}
                className={`group cursor-pointer bg-transparent hover:bg-card-bg/50 text-foreground border-2 border-border hover:border-accent font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 text-base sm:text-lg lg:hidden ${
                  !isInstallable || isInstalled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                {isInstalled ? 'App Instalado' : isIOS ? 'Instalar App' : isInstallable ? 'Baixar App' : 'Baixar App'}
              </button>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm text-text-muted">Usuários ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">2km</div>
                <div className="text-sm text-text-muted">Raio de busca</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">95%</div>
                <div className="text-sm text-text-muted">Satisfação</div>
                     </div>
                   </div>

                   </div>
                   
          {/* Visual Principal - Imagem Real de Pessoas Treinando */}
          <div className="relative">
            {/* Imagem de Pessoas Treinando */}
            <div className="flex justify-center items-center">
              <div className="relative">
                {/* Container da Imagem */}
                <div className="w-[40rem] h-[30rem] rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Imagem de Fundo - Unsplash (100% Livre) */}
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Pessoas treinando na academia"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Escuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Elementos de Movimento */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-accent/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-accent/20 rounded-full animate-spin-slow-reverse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}