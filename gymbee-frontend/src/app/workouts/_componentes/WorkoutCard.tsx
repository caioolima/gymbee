'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Flame, 
  Calendar, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Dumbbell
} from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workouts';
import { useState } from 'react';

interface WorkoutCardProps {
  workout: Workout;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getWorkoutTypeIcon: (type: WorkoutType) => any;
  getWorkoutTypeColor: (type: WorkoutType) => string;
  getWorkoutTypeLabel: (type: WorkoutType) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export function WorkoutCard({
  workout,
  index,
  onView,
  onEdit,
  onDelete,
  getWorkoutTypeIcon,
  getWorkoutTypeColor,
  getWorkoutTypeLabel,
  formatDate,
  formatTime
}: WorkoutCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const WorkoutIcon = getWorkoutTypeIcon(workout.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 relative group"
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-all duration-200 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-10 bg-card-bg border border-border/50 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
            <button
              onClick={() => {
                onView();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-input-bg flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </button>
            <button
              onClick={() => {
                onEdit();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-input-bg flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Workout Type Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} text-white mb-4`}>
        <WorkoutIcon className="w-4 h-4" />
        {getWorkoutTypeLabel(workout.type)}
      </div>

      {/* Workout Name */}
      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
        {workout.name}
      </h3>

      {/* Description */}
      {workout.description && (
        <p className="text-text-muted text-sm mb-4 line-clamp-2">
          {workout.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          <span>{workout.duration} min</span>
        </div>
        {workout.calories && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Flame className="w-4 h-4" />
            <span>{workout.calories} cal</span>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(workout.createdAt)} às {formatTime(workout.createdAt)}</span>
      </div>

      {/* Exercises Count */}
      {workout.exercises && workout.exercises.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Dumbbell className="w-4 h-4" />
          <span>{workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* View Button */}
      <button
        onClick={onView}
        className="w-full bg-gradient-to-r from-accent/20 to-yellow-300/20 hover:from-accent/30 hover:to-yellow-300/30 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Ver Detalhes
      </button>
    </motion.div>
  );
}
