'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Users, Clock, X, User } from 'lucide-react';
import { AvatarWithInitials } from './AvatarWithInitials';

interface Match {
  id: string;
  partner: {
    id: string;
    fullName: string;
    username: string;
    gender: string;
  };
  createdAt: string;
}

interface MatchesListProps {
  matches: Match[];
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: (user: any) => void;
}

export function MatchesList({ matches, isOpen, onClose, onViewProfile }: MatchesListProps) {
  if (!isOpen) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <AnimatePresence>
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-background via-background to-background/95 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden border border-border/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Seus Matches</h2>
              <p className="text-text-muted text-sm">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Matches List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum match ainda
              </h3>
              <p className="text-text-muted">
                Continue dando likes para encontrar seu parceiro de treino ideal!
              </p>
            </div>
          ) : (
            matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-card-bg/30 rounded-2xl border border-border/20 hover:border-accent/30 hover:bg-card-bg/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <AvatarWithInitials 
                      name={match.partner.fullName} 
                      size="w-16 h-16"
                      className="ring-2 ring-accent/30 group-hover:ring-accent/60 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-lg group-hover:text-accent transition-colors">
                      {match.partner.fullName}
                    </h4>
                    <p className="text-text-muted text-sm mb-1">
                      @{match.partner.username}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      <span>Match há {formatDate(match.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onViewProfile?.(match.partner)}
                      className="px-3 py-1.5 bg-gradient-to-r from-accent to-yellow-400 text-black text-sm font-semibold rounded-lg hover:from-accent/90 hover:to-yellow-400/90 transition-all duration-200 cursor-pointer"
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        {matches.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/20 text-center">
            <button
              onClick={onClose}
              className="text-text-muted hover:text-foreground transition-colors cursor-pointer text-sm"
            >
              Voltar ao swipe
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
}
