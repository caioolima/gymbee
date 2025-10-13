import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  distance?: number;
  checkIns?: CheckIn[];
}

export interface CheckIn {
  id: string;
  gymId: string;
  gym: Gym;
  checkInAt: string;
}

export interface CheckInData {
  gymId: string;
  latitude: number;
  longitude: number;
}

export function useGyms(userLocation: { lat: number; lon: number } | null) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: gyms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gyms', userLocation],
    queryFn: () => apiService.getGyms(token, userLocation?.lat, userLocation?.lon),
    enabled: !!token,
  });

  const checkInMutation = useMutation({
    mutationFn: (checkInData: CheckInData) => 
      apiService.checkInGym(checkInData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      queryClient.invalidateQueries({ queryKey: ['gym-checkins'] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao fazer check-in');
    },
  });

  const checkInGym = (checkInData: CheckInData) => {
    return checkInMutation.mutateAsync(checkInData);
  };

  return {
    gyms,
    isLoading,
    error,
    checkInGym,
    isCheckingIn: checkInMutation.isPending,
  };
}

export function useGymCheckIns() {
  const { token } = useAuth();

  const {
    data: checkIns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gym-checkins'],
    queryFn: () => apiService.getGymCheckIns(token),
    enabled: !!token,
  });

  return {
    checkIns,
    isLoading,
    error,
  };
}
