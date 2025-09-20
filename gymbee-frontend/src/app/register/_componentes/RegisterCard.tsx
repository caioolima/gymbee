'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Dumbbell, ArrowLeft } from 'lucide-react';
import { MemberRegisterForm } from './MemberRegisterForm';
import { TrainerRegisterForm } from './TrainerRegisterForm';
import { BirthDateForm } from './BirthDateForm';

type UserType = 'member' | 'trainer' | null;
type FormStep = 'selection' | 'form' | 'birthdate';

export function RegisterCard() {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('selection');

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentStep('form');
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setUserType(null);
      setCurrentStep('selection');
    } else if (currentStep === 'birthdate') {
      setCurrentStep('form');
    }
  };

  const handleFormSuccess = () => {
    setCurrentStep('birthdate');
  };

  const handleBirthDateComplete = (birthDate: string) => {
    // TODO: Salvar data de nascimento e finalizar cadastro
    console.log('Data de nascimento:', birthDate);
    // Redirecionar para login ou dashboard
    window.location.href = '/login';
  };

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-2xl p-8 w-full max-w-md border-border border-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/images/logo-gymbee.svg"
              alt="GymBee Logo"
              width={200}
              height={42}
              priority
              className="h-auto mx-auto"
            />
          </div>

          {/* Register Form */}
          {userType === 'member' ? (
            <MemberRegisterForm onSuccess={handleFormSuccess} />
          ) : (
            <TrainerRegisterForm onSuccess={handleFormSuccess} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo-gymbee.svg"
            alt="GymBee Logo"
            width={200}
            height={42}
            priority
            className="h-auto mx-auto"
          />
        </div>

        {/* Welcome Message */}
        <h1 className="text-foreground text-3xl font-bold text-center mb-12">
          Bem-vindo à GymBee
        </h1>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Member Card */}
          <div 
            onClick={() => handleUserTypeSelect('member')}
            className="bg-card-bg border border-border rounded-2xl p-8 cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Seja um membro
              </h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Acesse treinos personalizados, acompanhe seu progresso e encontre o personal ideal para a sua jornada.
              </p>
              <button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer">
                Próximo
              </button>
            </div>
          </div>

          {/* Trainer Card */}
          <div 
            onClick={() => handleUserTypeSelect('trainer')}
            className="bg-card-bg border border-border rounded-2xl p-8 cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Personal Trainer
              </h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Cadastre seu perfil profissional, gerencie clientes e crie treinos para expandir seu negócio.
              </p>
              <button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer">
                Próximo
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="text-center mt-8">
          <Link
            href="/home"
            className="text-text-muted hover:text-foreground transition-colors font-medium"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}
