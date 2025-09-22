'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Calendar, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { Workout, WorkoutType } from '@/types/workouts';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutListItem } from './WorkoutListItem';
import { WorkoutViewDialog } from './WorkoutViewDialog';
import { EditWorkoutDialog } from './EditWorkoutDialog';

interface WorkoutsListProps {
  viewMode: 'grid' | 'list';
}

export function WorkoutsList({ viewMode }: WorkoutsListProps) {
  const { workouts, isLoading, error, markWorkoutAsCompleted, updateWorkout, deleteWorkout, isMarkingComplete, isUpdating, isDeleting } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const getWorkoutTypeLabel = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.STRENGTH:
        return 'Força';
      case WorkoutType.CARDIO:
        return 'Cardio';
      case WorkoutType.FLEXIBILITY:
        return 'Flexibilidade';
      case WorkoutType.MIXED:
        return 'Misto';
      default:
        return 'Treino';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrar apenas treinos criados pelo usuário
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => 
      workout.source === 'user-created'
    );
  }, [workouts]);

  const handleViewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutDetails(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowEditDialog(true);
  };

  const handleDeleteWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowDeleteConfirm(true);
  };

  const handleSaveWorkout = (workoutId: string, workoutData: any) => {
    updateWorkout(workoutId, workoutData);
    setShowEditDialog(false);
    setSelectedWorkout(null);
  };

  const handleConfirmDelete = () => {
    if (selectedWorkout) {
      deleteWorkout(selectedWorkout.id);
      setShowDeleteConfirm(false);
      setSelectedWorkout(null);
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
          <Dumbbell className="w-6 h-6 text-black" />
        </motion.div>
        <p className="text-text-muted">Carregando treinos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <p className="text-red-500 mb-4">{error?.message || 'Erro ao carregar treinos'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-background font-semibold rounded-lg transition-all duration-200 cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (filteredWorkouts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          Nenhum treino registrado
        </h3>
        <p className="text-text-muted mb-4">
          Registre seu primeiro treino para começar!
        </p>
        <button
          onClick={() => window.location.href = '/workouts'}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-background font-semibold rounded-lg transition-all duration-200 cursor-pointer"
        >
          Registrar Primeiro Treino
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-text-muted">
          {filteredWorkouts.length} treino{filteredWorkouts.length !== 1 ? 's' : ''} encontrado{filteredWorkouts.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Calendar className="w-4 h-4" />
          <span>Ordenado por data</span>
        </div>
      </div>

      {/* Workouts Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              index={index}
              onView={() => handleViewWorkout(workout)}
              onEdit={() => handleEditWorkout(workout)}
              onDelete={() => handleDeleteWorkout(workout)}
              getWorkoutTypeIcon={getWorkoutTypeIcon}
              getWorkoutTypeColor={getWorkoutTypeColor}
              getWorkoutTypeLabel={getWorkoutTypeLabel}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout, index) => (
            <WorkoutListItem
              key={workout.id}
              workout={workout}
              index={index}
              onView={() => handleViewWorkout(workout)}
              onEdit={() => handleEditWorkout(workout)}
              onDelete={() => handleDeleteWorkout(workout)}
              getWorkoutTypeIcon={getWorkoutTypeIcon}
              getWorkoutTypeColor={getWorkoutTypeColor}
              getWorkoutTypeLabel={getWorkoutTypeLabel}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}

      {/* Workout Details Dialog */}
      <WorkoutViewDialog
        isOpen={showWorkoutDetails}
        onClose={() => {
          setShowWorkoutDetails(false);
          setSelectedWorkout(null);
        }}
        workout={selectedWorkout}
        onEdit={handleEditWorkout}
        onDelete={handleDeleteWorkout}
        onMarkAsCompleted={markWorkoutAsCompleted}
        isMarkingComplete={isMarkingComplete}
      />

      {/* Edit Workout Dialog */}
      <EditWorkoutDialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedWorkout(null);
        }}
        workout={selectedWorkout}
        onSave={handleSaveWorkout}
        isSaving={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-text-muted mb-6">
              Tem certeza que deseja excluir o treino <strong>"{selectedWorkout.name}"</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedWorkout(null);
                }}
                className="flex-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 text-gray-600 font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
