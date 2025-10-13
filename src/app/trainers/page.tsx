'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  MessageCircle, 
  Calendar, 
  Dumbbell, 
  Target, 
  Zap, 
  Phone, 
  Mail,
  Award,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTrainers } from '@/hooks/useTrainersQuery';
import { StandardLayout } from '@/components/StandardLayout';
import { AvatarWithInitials } from '@/components/AvatarWithInitials';

export default function TrainersPage() {
  const { user, token } = useAuth();
  const [showServices, setShowServices] = useState<{ [key: string]: boolean }>({});
  const { trainers, isLoading, error } = useTrainers();

  // Redirect if not authenticated
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h2>
          <p className="text-text-muted">Você precisa estar logado para acessar esta página</p>
        </div>
      </div>
    );
  }

  const getWorkoutIcon = (preference: string) => {
    switch (preference?.toLowerCase()) {
      case 'musculação':
      case 'strength':
        return Dumbbell;
      case 'cardio':
      case 'aeróbico':
        return Zap;
      case 'funcional':
      case 'crossfit':
        return Target;
      default:
        return Dumbbell;
    }
  };

  if (isLoading) {
    return (
      <StandardLayout title="Personal Trainers" subtitle="Encontre seu personal trainer ideal">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Personal Trainers" subtitle="Erro ao carregar">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar personal trainers</h2>
          <p className="text-text-muted">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </StandardLayout>
    );
  }

  if (!trainers || trainers.length === 0) {
    return (
      <StandardLayout title="Personal Trainers" subtitle="Nenhum personal trainer encontrado">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Nenhum personal trainer encontrado</h2>
          <p className="text-text-muted">Tente novamente mais tarde</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Personal Trainers" subtitle="Encontre seu personal trainer ideal">
      {/* Stats Header */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{trainers.length}</p>
                <p className="text-sm text-text-muted">Personal Trainers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-text-muted">Avaliação Média</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-text-muted">Profissionais Certificados</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers?.map((trainer: any, index: number) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg relative overflow-hidden hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 transform hover:scale-[1.02]"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
            
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-bl-2xl"></div>
            
            <div className="relative z-10">
              {/* Trainer Header */}
              <div className="relative h-32 bg-gradient-to-br from-accent/20 to-yellow-400/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-yellow-300/10" />
                
                {/* Profile Image Placeholder */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-card-bg/90 to-card-bg/80 backdrop-blur-sm rounded-full border-2 border-accent/30 flex items-center justify-center">
                  <AvatarWithInitials 
                    name={trainer.fullName}
                    size="md"
                    className="w-12 h-12"
                  />
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-yellow-400 rounded-full px-3 py-1 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-black" />
                    <span className="text-sm font-bold text-black">
                      {trainer.rating || 4.8}
                    </span>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-card-bg/90 backdrop-blur-sm rounded-full px-3 py-1 border border-border/30">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span className="text-xs text-foreground font-medium">
                        {trainer.location || 'São Paulo, SP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-6">
                {/* Trainer Details */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">{trainer.fullName}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-accent font-medium">Personal Trainer</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-sm text-text-muted">{trainer.age} anos</span>
                  </div>
                  <p className="text-xs text-text-muted">@{trainer.username}</p>
                </div>

                {/* CREF Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg px-3 py-2">
                    <Award className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-text-muted">CREF</p>
                      <p className="text-sm font-bold text-foreground">{trainer.cref}</p>
                    </div>
                  </div>
                </div>

                {/* Services Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    Serviços
                  </h4>
                  {trainer.services && trainer.services.length > 0 ? (
                    <div className="space-y-2">
                      {trainer.services.slice(0, 2).map((service: any) => (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-between items-center bg-gradient-to-r from-card-bg/50 to-card-bg/30 border border-border/30 rounded-xl p-3 hover:border-accent/30 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-lg flex items-center justify-center">
                              {React.createElement(getWorkoutIcon(service.name), { className: "w-4 h-4 text-accent" })}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{service.name}</p>
                              <p className="text-xs text-text-muted">{service.duration} min</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-accent">R$ {service.price}</p>
                          </div>
                        </motion.div>
                      ))}
                      {trainer.services.length > 2 && (
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-text-muted bg-card-bg/50 border border-border/30 rounded-lg px-3 py-1">
                            <span>+{trainer.services.length - 2} mais</span>
                            <span>•</span>
                            <span>Ver todos</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-card-bg/50 to-card-bg/30 border border-border/30 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Clock className="w-4 h-4" />
                          <p className="text-sm">Sem serviços cadastrados</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Ver Perfil</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-transparent border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </StandardLayout>
  );
}
