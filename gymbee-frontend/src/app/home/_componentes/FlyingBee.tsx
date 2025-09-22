'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useBeeSound } from './useBeeSound';

export function FlyingBee() {
  const [isHovered, setIsHovered] = useState(false);
  const { playBuzz } = useBeeSound();

  // Animação de voo da abelha - voando ao redor do dashboard
  const beeAnimation = {
    y: [0, -15, 5, -10, 0, -8, 0],
    x: [0, 10, -5, 15, -8, 12, 0],
    rotate: [0, 8, -3, 12, -5, 6, 0],
  };

  // Animação das asas
  const wingAnimation = {
    scaleY: [1, 0.8, 1, 0.9, 1],
  };

  return (
    <motion.div
      className="absolute z-10 hidden sm:block"
      style={{
        top: '25%',
        right: '15%',
      }}
      animate={beeAnimation}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      onHoverStart={() => {
        setIsHovered(true);
        playBuzz();
      }}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.2 }}
    >
      {/* Abelha */}
      <motion.div
        className="relative"
        animate={isHovered ? { 
          y: [0, -15, 0, -8, 0],
          x: [0, 8, -5, 12, 0],
          rotate: [0, 8, -5, 12, 0]
        } : {}}
        transition={{
          duration: 1.5,
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
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -top-1.5 left-3 w-4 h-3 bg-white/60 rounded-full"
            animate={wingAnimation}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.05
            }}
          />
          
          {/* Ferrão */}
          <div className="absolute -right-1 top-2.5 w-2 h-1 bg-gray-700 rounded-full"></div>
          <div className="absolute -right-2 top-2.5 w-1 h-0.5 bg-gray-800 rounded-full"></div>
        </div>
        
        {/* Trilha de voo */}
        <motion.div
          className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-200/30 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-200/20 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5
          }}
        />
      </motion.div>
      
      {/* Efeito de zumbido contínuo */}
      <motion.div
        className="absolute -top-8 -left-8 w-16 h-16 border-2 border-yellow-400/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Efeito de zumbido secundário */}
      <motion.div
        className="absolute -top-6 -left-6 w-12 h-12 border border-yellow-300/30 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Efeito de hover - zumbido intenso */}
      {isHovered && (
        <motion.div
          className="absolute -top-12 -left-12 w-24 h-24 border-4 border-yellow-400/50 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.5, 2],
            opacity: [0, 0.8, 0.5, 0]
          }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.div>
  );
}
