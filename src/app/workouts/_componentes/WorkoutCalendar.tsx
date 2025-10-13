'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar, 
  Clock, 
  Dumbbell,
  Activity,
  Zap,
  Target,
  CheckCircle,
  Circle,
  Trash2
} from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { Workout, WorkoutType } from '@/types/workouts';
import { WorkoutDayCard } from './WorkoutDayCard';
import { ScheduleWorkoutModal } from './ScheduleWorkoutModal';
import { WeeklyPlanningModal } from './WeeklyPlanningModal';
import { WorkoutDetailsDialog } from './WorkoutDetailsDialog';
import { RegisterWorkoutModal } from '@/app/dashboard/_componentes/RegisterWorkoutModal';

// Obter início da semana (segunda-feira)
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  // Domingo = 0, Segunda = 1, etc.
  // Para começar na segunda-feira: se for domingo (0), voltar 6 dias; senão voltar (day - 1) dias
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function WorkoutCalendar() {
  const { workouts, isLoading, error, markWorkoutAsCompleted, isMarkingComplete, deleteWorkout } = useWorkouts();
  const [currentWeek, setCurrentWeek] = useState(() => {
    // Inicializar com o início da semana atual (segunda-feira)
    const today = new Date();
    return getWeekStart(today);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWeeklyPlanning, setShowWeeklyPlanning] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [selectedDayForDetails, setSelectedDayForDetails] = useState<Date | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);

  // Obter fim da semana (domingo)
  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  // Removido useEffect que mudava automaticamente a semana
  // Agora sempre mostra a semana atual por padrão

  // Obter dias da semana
  const getWeekDays = (date: Date) => {
    const start = getWeekStart(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Obter treinos de um dia específico
  const getWorkoutsForDay = (date: Date) => {
    const targetDate = date.toDateString(); // "Mon Sep 15 2025"
    
    const dayWorkouts = workouts.filter(workout => {
      // Se tem scheduledDate, usar ela; senão usar createdAt
      const workoutDate = workout.scheduledDate 
        ? new Date(workout.scheduledDate) 
        : new Date(workout.createdAt);
      
      const matches = workoutDate.toDateString() === targetDate;
      
      
      return matches;
    });
    
    return dayWorkouts;
  };

  // Obter treinos planejados para um dia (simulado por enquanto)
  const getPlannedWorkoutsForDay = (date: Date) => {
    // TODO: Implementar sistema de treinos planejados
    // Por enquanto, retornar treinos já realizados
    return getWorkoutsForDay(date);
  };

  const weekDays = getWeekDays(currentWeek);
  const weekStart = getWeekStart(currentWeek);
  const weekEnd = getWeekEnd(currentWeek);



  const formatWeekRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const endStr = end.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    // Ir para a próxima semana (semana futura)
    const today = new Date();
    const currentWeekStart = getWeekStart(today);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeek(nextWeekStart);
  };

  const handleViewWorkouts = (day: Date) => {
    setSelectedDayForDetails(day);
    setShowWorkoutDetails(true);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkoutToDelete(workoutId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWorkout = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete);
      setShowDeleteConfirm(false);
      setWorkoutToDelete(null);
    }
  };

  const cancelDeleteWorkout = () => {
    setShowDeleteConfirm(false);
    setWorkoutToDelete(null);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return Dumbbell;
      case WorkoutType.CARDIO:
        return Activity;
      case WorkoutType.FLEXIBILITY:
        return Zap;
      case WorkoutType.MIXED:
        return Target;
      default:
        return Dumbbell;
    }
  };

  const getWorkoutTypeColor = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return 'from-red-500 to-red-600';
      case WorkoutType.CARDIO:
        return 'from-blue-500 to-blue-600';
      case WorkoutType.FLEXIBILITY:
        return 'from-green-500 to-green-600';
      case WorkoutType.MIXED:
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Calendar className="w-6 h-6 text-black" />
        </motion.div>
        <p className="text-text-muted">Carregando calendário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <p className="text-red-500 mb-4">{error?.message || 'Erro ao carregar calendário'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-background font-semibold rounded-lg transition-all duration-200 cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-300 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-black" />
              </div>
              Calendário de Treinos
            </h2>
            <p className="text-text-muted mt-1 text-sm">
              {formatWeekRange(weekStart, weekEnd)}
            </p>
            
            {/* Planejar Semana Button */}
            <div className="mt-4">
              <button
                onClick={() => setShowWeeklyPlanning(true)}
                className="group px-6 py-3 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-bold rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.05] hover:shadow-lg hover:shadow-accent/25 flex items-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Planejar Semana
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gradient-to-r from-input-bg to-input-bg/80 hover:from-accent/10 hover:to-yellow-300/10 text-text-muted hover:text-foreground rounded-xl transition-all duration-300 cursor-pointer border border-border/30 font-medium text-sm"
            >
              Hoje
            </button>
            
            <div className="flex items-center gap-1 bg-gradient-to-r from-input-bg to-input-bg/80 backdrop-blur-sm rounded-xl p-1 border border-border/30">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-card-bg/50 rounded-lg transition-all duration-300 cursor-pointer group"
              >
                <ChevronLeft className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-card-bg/50 rounded-lg transition-all duration-300 cursor-pointer group"
              >
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayWorkouts = getWorkoutsForDay(day);
          const plannedWorkouts = getPlannedWorkoutsForDay(day);
          const isCurrentDay = isToday(day);
          const isPastDay = isPast(day);
          
          return (
            <WorkoutDayCard
              key={day.toISOString()}
              day={day}
              workouts={dayWorkouts}
              plannedWorkouts={plannedWorkouts}
              isToday={isCurrentDay}
              isPast={isPastDay}
              onAddWorkout={() => {
                setSelectedDate(day);
                setShowScheduleModal(true);
              }}
              onViewWorkouts={() => handleViewWorkouts(day)}
              onDeleteWorkout={handleDeleteWorkout}
              getWorkoutTypeIcon={getWorkoutTypeIcon}
              getWorkoutTypeColor={getWorkoutTypeColor}
            />
          );
        })}
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleWorkoutModal
          selectedDate={selectedDate}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedDate(null);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterWorkoutModal
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showWeeklyPlanning && (
        <WeeklyPlanningModal
          currentWeek={currentWeek}
          selectedDate={selectedDate || undefined}
          onClose={() => setShowWeeklyPlanning(false)}
        />
      )}

      {showWorkoutDetails && selectedDayForDetails && (
        <WorkoutDetailsDialog
          isOpen={showWorkoutDetails}
          onClose={() => {
            setShowWorkoutDetails(false);
            setSelectedDayForDetails(null);
          }}
          day={selectedDayForDetails}
          workouts={getWorkoutsForDay(selectedDayForDetails)}
          plannedWorkouts={getPlannedWorkoutsForDay(selectedDayForDetails)}
          getWorkoutTypeIcon={getWorkoutTypeIcon}
          getWorkoutTypeColor={getWorkoutTypeColor}
          onMarkAsCompleted={markWorkoutAsCompleted}
          onDeleteWorkout={deleteWorkout}
          isMarkingComplete={isMarkingComplete}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-card-bg to-card-bg/95 backdrop-blur-sm border border-border/50 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 rounded-3xl"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-red-500/10 to-red-600/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Excluir Treino
              </h3>
              
              {/* Message */}
              <p className="text-base text-text-muted mb-8">
                Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={cancelDeleteWorkout}
                  className="flex-1 px-6 py-3 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-xl transition-all duration-200 cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteWorkout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500/90 hover:to-red-600/90 text-white font-bold rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
