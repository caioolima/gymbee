'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Dumbbell, ArrowLeft, Target, Users, Star, CheckCircle } from 'lucide-react';
import { MemberRegisterForm } from './MemberRegisterForm';
import { TrainerRegisterForm } from './TrainerRegisterForm';
import { BirthDateForm } from './BirthDateForm';
import { FitnessQuestions } from './FitnessQuestions';
import { LoadingScreen } from './LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';

type UserType = 'member' | 'trainer' | null;
type FormStep = 'selection' | 'form' | 'birthdate' | 'loading' | 'fitness';

export function RegisterCard() {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('selection');
  const [formData, setFormData] = useState<any>(null);
  const [fitnessData, setFitnessData] = useState<any>(null);
  const { registerUser, registerTrainer, token } = useAuth();

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentStep('form');
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Botão voltar clicado, currentStep:', currentStep, 'userType:', userType);
    if (currentStep === 'form') {
      setUserType(null);
      setCurrentStep('selection');
    } else if (currentStep === 'birthdate') {
      setCurrentStep('form');
    } else if (currentStep === 'fitness') {
      setCurrentStep('birthdate');
    } else if (currentStep === 'loading') {
      setCurrentStep('birthdate');
    }
  };

  const handleFormSuccess = (data: any) => {
    setFormData(data);
    setCurrentStep('birthdate');
  };

  const handleBirthDateComplete = async (birthDate: string) => {
    if (!formData) return;
    
    try {
      // Mostrar tela de carregamento
      setCurrentStep('loading');
      
      // Adicionar a data de nascimento aos dados
      const completeData = {
        ...formData,
        birthDate: birthDate
      };
      
      console.log('Dados completos para cadastro:', completeData);
      
      // Fazer o registro com os dados completos
      if (userType === 'member') {
        await registerUser(completeData);
        
        // Toast de sucesso
        toast.success('Conta criada com sucesso! 🎉', {
          duration: 3000,
        });
        
        // Aguardar um pouco para mostrar o toast
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Para membros, ir para perguntas fitness
        setCurrentStep('fitness');
      } else {
        await registerTrainer(completeData);
        
        // Toast de sucesso
        toast.success('Conta de trainer criada com sucesso! 🏋️‍♂️', {
          duration: 3000,
        });
        
        // Aguardar um pouco para mostrar o toast
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Para trainers, redirecionar direto para dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
      
      // Toast de erro
      toast.error('Erro ao criar conta. Tente novamente.', {
        duration: 4000,
      });
      
      // Voltar para o formulário em caso de erro, mas manter os dados
      setCurrentStep('form');
    }
  };

  const handleFitnessComplete = async (data: any) => {
    try {
      setFitnessData(data);
      console.log('Dados fitness:', data);
      
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

      console.log('Enviando dados para API:', goalData);
      
      // Salvar dados fitness no backend
      await apiService.createGoal(goalData, token);
      
      // Toast de sucesso
      toast.success('Perfil fitness criado com sucesso! 🏋️‍♂️', {
        duration: 3000,
      });
      
      // Aguardar um pouco para mostrar o toast
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao salvar dados fitness:', error);
      
      // Toast de erro
      toast.error('Erro ao salvar perfil fitness. Tente novamente.', {
        duration: 4000,
      });
    }
  };

  if (currentStep === 'loading') {
    return (
      <LoadingScreen 
        message="Criando sua conta..."
        isSuccess={false}
      />
    );
  }

  if (currentStep === 'fitness') {
    return (
      <FitnessQuestions 
        onBack={handleBack}
        onComplete={handleFitnessComplete}
      />
    );
  }

  if (currentStep === 'birthdate') {
    return (
      <BirthDateForm 
        onBack={handleBack}
        onComplete={handleBirthDateComplete}
      />
    );
  }

  if (userType && currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
          <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border border-border/50 shadow-xl relative">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-text-muted hover:text-foreground transition-colors cursor-pointer group"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            {/* Logo */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/logo-gymbee.svg"
                alt="GymBee Logo"
                width={180}
                height={38}
                priority
                className="h-auto mx-auto"
              />
            </motion.div>

            {/* Register Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {userType === 'member' ? (
                    <MemberRegisterForm onSuccess={handleFormSuccess} initialData={formData} />
                  ) : (
                    <TrainerRegisterForm onSuccess={handleFormSuccess} />
                  )}
                </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/images/logo-gymbee.svg"
                alt="GymBee Logo"
                width={240}
                height={50}
                priority
                className="h-auto mx-auto drop-shadow-lg"
              />
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="mb-6">
                <img 
                  src="/images/logo-gymbee.svg" 
                  alt="GymBee" 
                  className="h-16 w-auto mx-auto"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Bem-vindo à GymBee
              </h1>
              <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed font-medium">
                Escolha como você quer começar sua jornada fitness e transforme seus treinos para sempre
              </p>
            </motion.div>
          </motion.div>

          {/* User Type Selection */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Member Card */}
            <motion.div 
              onClick={() => handleUserTypeSelect('member')}
              className="group relative bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 overflow-hidden h-full flex flex-col"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center flex flex-col h-full">
                {/* Icon */}
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Users className="w-12 h-12 text-accent" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                  Seja um Membro
                </h2>

                {/* Description */}
                <p className="text-text-muted mb-8 leading-relaxed text-base">
                  Acesse treinos personalizados, acompanhe seu progresso e encontre o personal ideal para acelerar seus resultados.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8 text-left flex-grow">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Treinos personalizados</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Acompanhamento de progresso</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Encontre duplas de treino</span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button 
                  className="w-full bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2 cursor-pointer mt-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target className="w-5 h-5" />
                  Começar como Membro
                </motion.button>
              </div>
            </motion.div>

            {/* Trainer Card */}
            <motion.div 
              onClick={() => handleUserTypeSelect('trainer')}
              className="group relative bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 overflow-hidden h-full flex flex-col"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center flex flex-col h-full">
                {/* Icon */}
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: -5 }}
                >
                  <Dumbbell className="w-12 h-12 text-accent" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                  Personal Trainer
                </h2>

                {/* Description */}
                <p className="text-text-muted mb-8 leading-relaxed text-base">
                  Cadastre seu perfil profissional, gerencie clientes e crie treinos para expandir seu negócio.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8 text-left flex-grow">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Gerencie seus clientes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Crie treinos personalizados</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>Expanda seu negócio</span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button 
                  className="w-full bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2 cursor-pointer mt-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star className="w-5 h-5" />
                  Começar como Trainer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-text-muted hover:text-foreground transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
