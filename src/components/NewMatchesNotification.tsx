'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

interface NewMatchesNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onViewMatches: () => void;
  newMatchesCount: number;
}

export function NewMatchesNotification({ 
  isVisible, 
  onClose, 
  onViewMatches, 
  newMatchesCount 
}: NewMatchesNotificationProps) {
  if (!isVisible || newMatchesCount === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </motion.div>
                <span className="font-bold text-lg">Novos Matches!</span>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-sm opacity-90 mb-2">
                {newMatchesCount === 1 
                  ? 'Você tem um novo match!' 
                  : `Você tem ${newMatchesCount} novos matches!`
                }
              </p>
              <p className="text-xs opacity-75">
                Alguém também curtiu você! Que tal conversar?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onViewMatches}
                className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm transition-colors cursor-pointer backdrop-blur-sm"
              >
                Ver Matches
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Depois
              </button>
            </div>

            {/* Pulse Effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl -z-10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
