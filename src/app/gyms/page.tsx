'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, CheckCircle, Navigation, Phone, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGyms, useGymCheckIns } from '@/hooks/useGymsQuery';
import { StandardLayout } from '@/components/StandardLayout';

export default function GymsPage() {
  const { user, token } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { gyms, isLoading, error, checkInGym } = useGyms(userLocation);
  const { checkIns, isLoading: loadingCheckIns } = useGymCheckIns();

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  const handleCheckIn = async (gymId: string) => {
    if (!userLocation) {
      alert('Localização necessária para check-in');
      return;
    }

    try {
      await checkInGym({
        gymId,
        latitude: userLocation.lat,
        longitude: userLocation.lon,
      });
    } catch (error) {
      console.error('Erro no check-in:', error);
    }
  };

  if (isLoading) {
    return (
      <StandardLayout title="Academias" subtitle="Encontre academias próximas">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Academias" subtitle="Erro ao carregar">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar academias</h2>
          <p className="text-text-muted">{error}</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Academias" subtitle="Encontre academias próximas">
      <div className="mb-8">

        {!userLocation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              📍 Permitir localização para encontrar academias próximas
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {gyms?.map((gym: any, index: number) => (
            <motion.div
              key={gym.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{gym.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{gym.address}</span>
                    </div>
                    {gym.phone && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Phone className="w-4 h-4 mr-1" />
                        <span className="text-sm">{gym.phone}</span>
                      </div>
                    )}
                    {gym.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-1" />
                        <a 
                          href={gym.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          {gym.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                      {gym.distance ? `${gym.distance.toFixed(1)} km` : 'Próximo'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{gym.checkIns?.length || 0} check-ins hoje</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Aberto 24h</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCheckIn(gym.id)}
                    className="bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Check-in
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Check-ins Recentes */}
        {checkIns && checkIns.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Seus Check-ins Recentes</h2>
            <div className="grid gap-4">
              {checkIns.slice(0, 5).map((checkIn: any, index: number) => (
                <motion.div
                  key={checkIn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{checkIn.gym.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(checkIn.checkInAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        +10 pontos
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StandardLayout>
  );
}
