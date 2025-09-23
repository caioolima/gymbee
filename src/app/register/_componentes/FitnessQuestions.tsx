'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Weight, Ruler, Calendar, Activity, Trophy } from 'lucide-react';

interface FitnessQuestionsProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

export function FitnessQuestions({ onBack, onComplete }: FitnessQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    goalType: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    activityLevel: '',
    experienceLevel: '',
    deadline: '',
  });

  const steps = [
    {
      title: 'Qual seu objetivo principal?',
      icon: Target,
      fields: [
        { value: 'LOSE_WEIGHT', label: 'Perder Peso', description: 'Queimar gordura e definir o corpo' },
        { value: 'GAIN_MASS', label: 'Ganhar Massa', description: 'Aumentar massa muscular' },
        { value: 'IMPROVE_CONDITIONING', label: 'Melhorar Condicionamento', description: 'Aumentar resistência e força' },
      ],
      fieldName: 'goalType',
    },
    {
      title: 'Seu peso atual',
      icon: Weight,
      fields: [
        { value: 'currentWeight', label: 'Peso (kg)', placeholder: 'Ex: 70', type: 'number' },
      ],
      fieldName: 'currentWeight',
    },
    {
      title: 'Peso desejado',
      icon: Target,
      fields: [
        { value: 'targetWeight', label: 'Peso objetivo (kg)', placeholder: 'Ex: 65', type: 'number' },
      ],
      fieldName: 'targetWeight',
    },
    {
      title: 'Sua altura',
      icon: Ruler,
      fields: [
        { value: 'height', label: 'Altura (cm)', placeholder: 'Ex: 175', type: 'number' },
      ],
      fieldName: 'height',
    },
    {
      title: 'Nível de atividade física',
      icon: Activity,
      fields: [
        { value: 'SEDENTARY', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
        { value: 'LIGHT', label: 'Leve', description: 'Exercício leve 1-3 dias/semana' },
        { value: 'MODERATE', label: 'Moderado', description: 'Exercício moderado 3-5 dias/semana' },
        { value: 'ACTIVE', label: 'Ativo', description: 'Exercício intenso 6-7 dias/semana' },
        { value: 'VERY_ACTIVE', label: 'Muito Ativo', description: 'Exercício muito intenso, trabalho físico' },
      ],
      fieldName: 'activityLevel',
    },
    {
      title: 'Experiência com exercícios',
      icon: Trophy,
      fields: [
        { value: 'BEGINNER', label: 'Iniciante', description: 'Pouca experiência com exercícios' },
        { value: 'INTERMEDIATE', label: 'Intermediário', description: 'Alguma experiência com exercícios' },
        { value: 'ADVANCED', label: 'Avançado', description: 'Muita experiência com exercícios' },
      ],
      fieldName: 'experienceLevel',
    },
        {
          title: 'Prazo para alcançar o objetivo (opcional)',
          icon: Calendar,
          fields: [
            { value: 'deadline', label: 'Data limite (opcional)', placeholder: 'Ex: 2024-12-31', type: 'date' },
            { value: 'skip', label: 'Pular esta pergunta', description: 'Não tenho um prazo específico' },
          ],
          fieldName: 'deadline',
        },
  ];

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    const fieldValue = formData[currentStepData.fieldName as keyof typeof formData];

    // Para a última pergunta (deadline), permitir pular
    if (currentStep === steps.length - 1) {
      if (!fieldValue || fieldValue === 'skip') {
        // Se pulou ou não preencheu, remover deadline dos dados
        const finalData = {
          goalType: formData.goalType,
          currentWeight: parseFloat(formData.currentWeight),
          targetWeight: parseFloat(formData.targetWeight),
          height: parseFloat(formData.height),
          activityLevel: formData.activityLevel,
          experienceLevel: formData.experienceLevel,
          // deadline não incluído se pulou
        };
        onComplete(finalData);
        return;
      }
    }

    if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
      alert('Por favor, preencha este campo para continuar.');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calcular deadline inteligente baseado no objetivo
      const getDefaultDeadline = (goalType: string, currentWeight: number, targetWeight: number) => {
        const weightDifference = Math.abs(targetWeight - currentWeight);
        
        // Baseado na diferença de peso e tipo de objetivo
        let daysToAdd = 90; // Padrão: 3 meses
        
        if (weightDifference <= 5) {
          daysToAdd = 60; // 2 meses para mudanças pequenas
        } else if (weightDifference <= 10) {
          daysToAdd = 120; // 4 meses para mudanças médias
        } else {
          daysToAdd = 180; // 6 meses para mudanças grandes
        }
        
        return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
      };

      // Converter dados para o formato esperado pelo backend
      const fitnessData = {
        goalType: formData.goalType,
        currentWeight: parseFloat(formData.currentWeight) || 0,
        targetWeight: parseFloat(formData.targetWeight) || 0,
        height: parseFloat(formData.height) || 0,
        activityLevel: formData.activityLevel,
        experienceLevel: formData.experienceLevel,
        deadline: formData.deadline 
          ? new Date(formData.deadline).toISOString() 
          : getDefaultDeadline(formData.goalType, parseFloat(formData.currentWeight) || 0, parseFloat(formData.targetWeight) || 0).toISOString(),
      };
      
      console.log('=== FITNESS QUESTIONS DEBUG ===');
      console.log('FormData original:', formData);
      console.log('FitnessData processado:', fitnessData);
      console.log('Tipos dos dados:', {
        goalType: typeof fitnessData.goalType,
        currentWeight: typeof fitnessData.currentWeight,
        targetWeight: typeof fitnessData.targetWeight,
        height: typeof fitnessData.height,
        activityLevel: typeof fitnessData.activityLevel,
        experienceLevel: typeof fitnessData.experienceLevel,
        deadline: typeof fitnessData.deadline,
      });
      console.log('===============================');
      onComplete(fitnessData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const currentStepData = steps[currentStep];
  const isStepValid = formData[currentStepData.fieldName as keyof typeof formData] !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border border-border/50 shadow-xl relative">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors cursor-pointer group"
              type="button"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">Pergunta {currentStep + 1} de {steps.length}</span>
              <span className="text-sm text-text-muted">{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-input-bg rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-accent to-yellow-300 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.title}
            </h1>
          </motion.div>

          {/* Options/Input */}
          <motion.div
            key={`options-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {currentStepData.fields.map((field, index) => (
              <div key={index}>
                {field.type === 'number' || field.type === 'date' ? (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formData[currentStepData.fieldName as keyof typeof formData]}
                      onChange={(e) => handleInputChange(currentStepData.fieldName, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleInputChange(currentStepData.fieldName, field.value)}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 cursor-pointer ${
                      formData[currentStepData.fieldName as keyof typeof formData] === field.value
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-input-border bg-input-bg hover:border-accent/50 text-foreground'
                    }`}
                  >
                    <div className="font-medium">{field.label}</div>
                    {field.description && (
                      <div className="text-sm text-text-muted mt-1">{field.description}</div>
                    )}
                  </button>
                )}
              </div>
            ))}
          </motion.div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            disabled={!isStepValid}
            className="w-full bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
            whileHover={{ scale: isStepValid ? 1.02 : 1 }}
            whileTap={{ scale: isStepValid ? 0.98 : 1 }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Target className="w-5 h-5" />
                Finalizar Cadastro
              </>
            ) : (
              'Próxima Pergunta'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
