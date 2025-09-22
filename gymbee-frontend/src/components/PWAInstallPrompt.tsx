'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se é mobile
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    setIsMobile(mobile);

    // Detectar se já está instalado como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Só mostrar se for mobile
      if (mobile) {
        setShowInstallPrompt(true);
      }
    };

    // Listener para o evento appinstalled
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado com sucesso!');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Salvar no localStorage que o usuário dispensou
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // Não mostrar se já está instalado, se foi dispensado ou se não for mobile
  if (isStandalone || (typeof window !== 'undefined' && localStorage.getItem('pwa-install-dismissed') === 'true') || !isMobile) {
    return null;
  }

  // Para iOS, mostrar instruções de instalação
  if (isIOS && !isStandalone) {
    return (
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-accent to-yellow-400 text-black rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">Instalar GymBee</h3>
                <p className="text-xs text-black/80 mb-2">
                  Toque no botão de compartilhar e selecione &quot;Adicionar à Tela Inicial&quot;
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDismiss}
                    className="text-black/60 hover:text-black text-xs cursor-pointer"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-black/60 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Para Android/Desktop, mostrar prompt nativo
  return (
    <AnimatePresence>
      {showInstallPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-accent to-yellow-400 text-black rounded-2xl p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <Download className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">Instalar GymBee</h3>
              <p className="text-xs text-black/80 mb-3">
                Instale o app para uma experiência mais rápida e acesso offline
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-black/60 hover:text-black text-xs cursor-pointer"
                >
                  Agora não
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-black/60 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
