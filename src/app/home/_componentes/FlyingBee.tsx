'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useBeeSound } from './useBeeSound';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FlyingBee() {
  const [isHovered, setIsHovered] = useState(false);
  const { playBuzz } = useBeeSound();
  const shouldReduceMotion = useReducedMotion();

  // Animação de voo da abelha - simplificada para mobile
  const beeAnimation = shouldReduceMotion ? {} : {
    y: [0, -8, 3, -5, 0],
    x: [0, 5, -3, 8, 0],
    rotate: [0, 4, -2, 6, 0],
  };

  // Animação das asas - simplificada
  const wingAnimation = shouldReduceMotion ? {} : {
    scaleY: [1, 0.9, 1],
  };

  // Desabilita completamente no mobile para melhor performance
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute z-10 hidden sm:block"
      style={{
        top: '25%',
        right: '15%',
      }}
      animate={beeAnimation}
      transition={shouldReduceMotion ? {} : {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      onHoverStart={() => {
        setIsHovered(true);
        playBuzz();
      }}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
    >
      {/* Abelha */}
      <motion.div
        className="relative"
        animate={isHovered && !shouldReduceMotion ? { 
          y: [0, -8, 0, -4, 0],
          x: [0, 4, -3, 6, 0],
          rotate: [0, 4, -3, 6, 0]
        } : {}}
        transition={shouldReduceMotion ? {} : {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Corpo da abelha */}
        <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full relative">
          {/* Listras pretas */}
          <div className="absolute top-1 left-1 w-8 h-1 bg-black rounded-full"></div>
          <div className="absolute top-2.5 left-1 w-8 h-1 bg-black rounded-full"></div>
          <div className="absolute top-4 left-1 w-8 h-1 bg-black rounded-full"></div>
          
          {/* Cabeça */}
          <div className="absolute -left-2 top-0.5 w-5 h-5 bg-yellow-300 rounded-full">
            {/* Olhos */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          
          {/* Asas */}
          <motion.div
            className="absolute -top-2 left-2 w-6 h-4 bg-white/80 rounded-full"
            animate={wingAnimation}
            transition={shouldReduceMotion ? {} : {
              duration: 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -top-1.5 left-3 w-4 h-3 bg-white/60 rounded-full"
            animate={wingAnimation}
            transition={shouldReduceMotion ? {} : {
              duration: 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          {/* Ferrão */}
          <div className="absolute -right-1 top-2.5 w-2 h-1 bg-gray-700 rounded-full"></div>
          <div className="absolute -right-2 top-2.5 w-1 h-0.5 bg-gray-800 rounded-full"></div>
        </div>
        
        {/* Trilha de voo - simplificada para mobile */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-200/30 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-200/20 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1
              }}
            />
          </>
        )}
      </motion.div>
      
      {/* Efeito de zumbido contínuo - simplificado para mobile */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-8 -left-8 w-16 h-16 border-2 border-yellow-400/20 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute -top-6 -left-6 w-12 h-12 border border-yellow-300/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </>
      )}
      
      {/* Efeito de hover - zumbido intenso - simplificado */}
      {isHovered && !shouldReduceMotion && (
        <motion.div
          className="absolute -top-12 -left-12 w-20 h-20 border-2 border-yellow-400/40 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.2],
            opacity: [0, 0.6, 0]
          }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
}
