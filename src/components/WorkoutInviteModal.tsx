'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Dumbbell, FileText, Target, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';

interface WorkoutInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (inviteData: WorkoutInviteData) => void;
  invitedUser: {
    id: string;
    fullName: string;
    username: string;
  };
}

interface WorkoutInviteData {
  inviteeId: string;
  workoutName: string;
  workoutType: 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | 'BALANCE';
  description?: string;
  scheduledDate: string;
  duration?: number;
  location?: string;
}

const workoutTypes = [
  { value: 'STRENGTH', label: 'Força', icon: Dumbbell, color: 'from-red-500 to-red-600' },
  { value: 'CARDIO', label: 'Cardio', icon: Zap, color: 'from-orange-500 to-orange-600' },
  { value: 'FLEXIBILITY', label: 'Flexibilidade', icon: Target, color: 'from-green-500 to-green-600' },
  { value: 'BALANCE', label: 'Equilíbrio', icon: FileText, color: 'from-blue-500 to-blue-600' },
];

export function WorkoutInviteModal({ isOpen, onClose, onSendInvite, invitedUser }: WorkoutInviteModalProps) {
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkoutInviteData>({
    inviteeId: invitedUser.id,
    workoutName: '',
    workoutType: 'STRENGTH',
    description: '',
    scheduledDate: '',
    duration: 60,
    location: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingInvite, setHasPendingInvite] = useState(false);
  const [isCheckingInvites, setIsCheckingInvites] = useState(true);

  // Check for existing pending invites when modal opens
  useEffect(() => {
    const checkExistingInvites = async () => {
      if (!isOpen || !token) return;
      
      setIsCheckingInvites(true);
      try {
        const sentInvites = await apiService.getSentWorkoutInvites(token);
        const pendingInvite = sentInvites.find(invite => 
          invite.inviteeId === invitedUser.id && 
          (invite.status === 'PENDING' || invite.status === 'MODIFIED')
        );
        setHasPendingInvite(!!pendingInvite);
      } catch (error) {
        console.error('Erro ao verificar convites:', error);
      } finally {
        setIsCheckingInvites(false);
      }
    };

    checkExistingInvites();
  }, [isOpen, token, invitedUser.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate and convert scheduledDate to ISO 8601 format
      if (!formData.scheduledDate) {
        throw new Error('Data e hora são obrigatórias');
      }
      
      const date = new Date(formData.scheduledDate);
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }
      
      const submitData = {
        ...formData,
        scheduledDate: date.toISOString(),
      };
      
      await onSendInvite(submitData);
      onClose();
      // Reset form
      setFormData({
        inviteeId: invitedUser.id,
        workoutName: '',
        workoutType: 'STRENGTH',
        description: '',
        scheduledDate: '',
        duration: 60,
        location: '',
      });
      setCurrentStep(1); // Reset to first step
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      alert(error.message || 'Erro ao enviar convite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof WorkoutInviteData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.workoutName.trim() !== '';
      case 2: return formData.workoutType !== '';
      case 3: return formData.scheduledDate !== '';
      case 4: return true; // Step 4 é opcional
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -10 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 10 }}
          transition={{ type: "spring", damping: 15, stiffness: 150 }}
          className="relative w-full max-w-md max-h-[90vh] bg-gradient-to-b from-card-bg via-card-bg/95 to-card-bg rounded-3xl overflow-hidden border border-border/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-yellow-300/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.1),transparent_50%)]"></div>
          
          {/* Header with Progress */}
          <div className="relative z-10 p-6 border-b border-border/20">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-muted/20 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-foreground font-bold text-lg">Criar Convite</h1>
              <div className="w-9"></div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="relative z-10 flex-1 overflow-y-auto">
            <div className="p-6 h-full flex flex-col justify-center">
              {isCheckingInvites ? (
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-text-muted">Verificando convites...</p>
                </div>
              ) : hasPendingInvite ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-foreground font-bold text-2xl mb-3">Convite Já Enviado</h2>
                  <p className="text-text-muted mb-8">
                    Você já enviou um convite de treino para <span className="font-semibold text-foreground">{invitedUser.fullName}</span>.
                    <br />
                    Aguarde a resposta antes de enviar outro convite.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-2xl hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer"
                  >
                    Entendi
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Dumbbell className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="text-foreground font-bold text-2xl mb-3">Como vai chamar?</h2>
                    <p className="text-text-muted mb-8">Dê um nome épico para seu treino</p>
                    <input
                      type="text"
                      value={formData.workoutName}
                      onChange={(e) => handleInputChange('workoutName', e.target.value)}
                      placeholder="Ex: Destruição Total"
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 text-foreground placeholder:text-text-muted font-medium text-center text-lg focus:outline-none focus:border-accent/50 transition-all duration-200"
                      autoFocus
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Dumbbell className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="text-foreground font-bold text-2xl mb-3">Que tipo?</h2>
                    <p className="text-text-muted mb-8">Escolha a vibe do treino</p>
                    <div className="grid grid-cols-2 gap-4">
                      {workoutTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleInputChange('workoutType', type.value)}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                              formData.workoutType === type.value
                                ? 'border-accent bg-accent/20 scale-105 shadow-lg shadow-accent/20'
                                : 'border-border/50 bg-muted/20 hover:bg-muted/30'
                            }`}
                          >
                            <IconComponent className={`w-10 h-10 mx-auto mb-3 ${
                              formData.workoutType === type.value ? 'text-accent' : 'text-text-muted'
                            }`} />
                            <span className={`text-sm font-semibold ${
                              formData.workoutType === type.value ? 'text-accent' : 'text-text-muted'
                            }`}>
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="text-foreground font-bold text-2xl mb-3">Quando?</h2>
                    <p className="text-text-muted mb-8">Defina data, hora e duração</p>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-accent" />
                          <span className="text-foreground font-medium">Data & Hora</span>
                        </div>
                        <input
                          type="datetime-local"
                          value={formData.scheduledDate}
                          onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-foreground"
                        />
                      </div>
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="w-5 h-5 text-accent" />
                          <span className="text-foreground font-medium">Duração</span>
                        </div>
                        <input
                          type="number"
                          min="15"
                          max="180"
                          step="15"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                          placeholder="60 min"
                          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-text-muted"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="text-foreground font-bold text-2xl mb-3">Detalhes</h2>
                    <p className="text-text-muted mb-8">Local e descrição (opcional)</p>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <MapPin className="w-5 h-5 text-accent" />
                          <span className="text-foreground font-medium">Local</span>
                        </div>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Ex: Academia Smart Fit - Paulista"
                          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-text-muted"
                        />
                      </div>
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <span className="text-foreground font-medium">Descrição</span>
                        </div>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Ex: Treino focado em peito e tríceps, vamos treinar pesado!"
                          rows={3}
                          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-text-muted resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          {!hasPendingInvite && !isCheckingInvites && (
            <div className="relative z-10 p-6 border-t border-border/20">
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 bg-muted/30 text-foreground font-semibold rounded-2xl hover:bg-muted/50 transition-all duration-200 cursor-pointer border border-border/20"
                  >
                    Voltar
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      'Enviar Convite'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
