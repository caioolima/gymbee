'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message: string;
  isSuccess?: boolean;
}

export function LoadingScreen({ message, isSuccess = false }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-12 border border-border/50 shadow-xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <CheckCircle className="w-12 h-12 text-accent" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-accent" />
              </motion.div>
            )}
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {message}
            </h1>
            
            {!isSuccess && (
              <p className="text-text-muted">
                Aguarde um momento...
              </p>
            )}
          </motion.div>

          {/* Loading dots */}
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center mt-6 space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
