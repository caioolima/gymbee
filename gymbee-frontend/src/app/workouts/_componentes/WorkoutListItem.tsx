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

interface WorkoutListItemProps {
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

export function WorkoutListItem({
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
}: WorkoutListItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const WorkoutIcon = getWorkoutTypeIcon(workout.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 relative group"
    >
      <div className="flex items-center gap-4">
        {/* Workout Icon */}
        <div className={`w-12 h-12 bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <WorkoutIcon className="w-6 h-6 text-white" />
        </div>

        {/* Workout Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {workout.name}
              </h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getWorkoutTypeColor(workout.type)} text-white`}>
                {getWorkoutTypeLabel(workout.type)}
              </div>
            </div>
            
            {/* Menu Button */}
            <div className="relative">
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
          </div>

          {/* Description */}
          {workout.description && (
            <p className="text-text-muted text-sm mb-3 line-clamp-1">
              {workout.description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workout.duration} min</span>
            </div>
            {workout.calories && (
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{workout.calories} cal</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(workout.createdAt)}</span>
            </div>
            {workout.exercises && workout.exercises.length > 0 && (
              <div className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4" />
                <span>{workout.exercises.length} exercícios</span>
              </div>
            )}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={onView}
          className="px-4 py-2 bg-gradient-to-r from-accent/20 to-yellow-300/20 hover:from-accent/30 hover:to-yellow-300/30 text-accent font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
        >
          Ver Detalhes
        </button>
      </div>
    </motion.div>
  );
}
