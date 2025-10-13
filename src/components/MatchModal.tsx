'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Users, X, User } from 'lucide-react';
import { AvatarWithInitials } from './AvatarWithInitials';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: (user: any) => void;
  matchedUser?: {
    id: string;
    fullName: string;
    username: string;
    gender: string;
    goalType?: string;
    experienceLevel?: string;
  };
}

export function MatchModal({ isOpen, onClose, onViewProfile, matchedUser }: MatchModalProps) {
  if (!isOpen || !matchedUser) return null;

  const getGoalTypeLabel = (goalType?: string) => {
    switch (goalType) {
      case 'LOSE_WEIGHT': return 'Perder Peso';
      case 'GAIN_MASS': return 'Ganhar Massa';
      case 'IMPROVE_CONDITIONING': return 'Melhorar Condicionamento';
      default: return 'Não definido';
    }
  };

  const getExperienceLevelLabel = (level?: string) => {
    switch (level) {
      case 'BEGINNER': return 'Iniciante';
      case 'INTERMEDIATE': return 'Intermediário';
      case 'ADVANCED': return 'Avançado';
      default: return 'Não definido';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-background via-background to-background/95 rounded-3xl p-8 max-w-md w-full mx-4 border border-border/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>

              {/* Match Animation */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                >
                  <Heart className="w-12 h-12 text-white fill-current" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-foreground mb-2"
                >
                  É um Match!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-text-muted"
                >
                  Vocês podem treinar juntos!
                </motion.p>
              </div>

              {/* User Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-8"
              >
                <div className="flex justify-center mb-4">
                  <AvatarWithInitials 
                    name={matchedUser.fullName} 
                    size="w-20 h-20" 
                    className="ring-4 ring-accent/30"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {matchedUser.fullName}
                </h3>
                
                <p className="text-text-muted mb-4">@{matchedUser.username}</p>
                
                {/* User Details */}
                <div className="space-y-2 text-sm">
                  {matchedUser.goalType && (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-text-muted">
                        Objetivo: {getGoalTypeLabel(matchedUser.goalType)}
                      </span>
                    </div>
                  )}
                  
                  {matchedUser.experienceLevel && (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-text-muted">
                        Nível: {getExperienceLevelLabel(matchedUser.experienceLevel)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <button
                  onClick={() => onViewProfile?.(matchedUser)}
                  className="w-full py-3 bg-gradient-to-r from-accent to-yellow-400 text-black font-bold rounded-xl hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer"
                >
                  Ver Perfil
                </button>
                
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar Mensagem
                </button>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-foreground transition-colors cursor-pointer text-sm"
                >
                  Continuar procurando
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
