'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FitnessQuestions } from '../register/_componentes/FitnessQuestions';
import { LoadingScreen } from '../register/_componentes/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';

function FitnessQuestionsContent() {
  const { token, hasActiveGoal } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [needsQuestions, setNeedsQuestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Verificar se o usuário já respondeu as perguntas
        const hasGoal = await hasActiveGoal();
        
        if (hasGoal) {
          // Usuário já tem objetivo, redirecionar para dashboard
          router.push('/dashboard');
          return;
        }

        // Usuário precisa responder as perguntas
        setNeedsQuestions(true);
      } catch (error) {
        console.error('Erro ao verificar status do usuário:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [hasActiveGoal, router]);

  const handleFitnessComplete = async (data: any) => {
    try {
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Converter deadline para formato ISO (se existir)
      const goalData = {
        goalType: data.goalType,
        currentWeight: data.currentWeight,
        targetWeight: data.targetWeight,
        height: data.height,
        activityLevel: data.activityLevel,
        experienceLevel: data.experienceLevel,
        ...(data.deadline && data.deadline !== null && data.deadline !== undefined && { deadline: new Date(data.deadline).toISOString() }),
      };

      console.log('=== FRONTEND DEBUG ===');
      console.log('Dados recebidos do componente:', data);
      console.log('Dados processados para API:', goalData);
      console.log('Tipos dos dados:', {
        goalType: typeof goalData.goalType,
        currentWeight: typeof goalData.currentWeight,
        targetWeight: typeof goalData.targetWeight,
        height: typeof goalData.height,
        activityLevel: typeof goalData.activityLevel,
        experienceLevel: typeof goalData.experienceLevel,
        deadline: typeof goalData.deadline,
      });
      console.log('========================');
      
      // Salvar dados fitness no backend
      await apiService.createGoal(goalData, token);
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar dados fitness:', error);
      
      // Toast de erro
      toast.error('Erro ao salvar perfil fitness. Tente novamente.', {
        duration: 4000,
      });
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Verificando seu perfil..."
        isSuccess={false}
      />
    );
  }

  if (!needsQuestions) {
    return null; // Será redirecionado
  }

  return (
    <FitnessQuestions
      onBack={handleBack}
      onComplete={handleFitnessComplete}
    />
  );
}

export default function FitnessQuestionsPage() {
  return (
    <ProtectedRoute>
      <FitnessQuestionsContent />
    </ProtectedRoute>
  );
}
