'use client';

import { motion } from 'framer-motion';
import { X, Filter, Calendar, Clock, Flame } from 'lucide-react';
import { WorkoutType } from '@/types/workouts';
import { useState } from 'react';

interface WorkoutFiltersProps {
  onClose: () => void;
}

export function WorkoutFilters({ onClose }: WorkoutFiltersProps) {
  const [filters, setFilters] = useState({
    type: 'ALL' as WorkoutType | 'ALL',
    dateRange: 'ALL' as 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR',
    minDuration: '',
    maxDuration: '',
    minCalories: '',
    maxCalories: '',
  });

  const workoutTypes = [
    { value: 'ALL' as const, label: 'Todos os tipos' },
    { value: WorkoutType.STRENGTH, label: 'Força' },
    { value: WorkoutType.CARDIO, label: 'Cardio' },
    { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade' },
    { value: WorkoutType.MIXED, label: 'Misto' },
  ];

  const dateRanges = [
    { value: 'ALL', label: 'Todas as datas' },
    { value: 'TODAY', label: 'Hoje' },
    { value: 'WEEK', label: 'Esta semana' },
    { value: 'MONTH', label: 'Este mês' },
    { value: 'YEAR', label: 'Este ano' },
  ];

  const handleApplyFilters = () => {
    // TODO: Implementar aplicação de filtros
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'ALL',
      dateRange: 'ALL',
      minDuration: '',
      maxDuration: '',
      minCalories: '',
      maxCalories: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Filtros</h3>
            <p className="text-sm text-text-muted">Filtre seus treinos por tipo, data e duração</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tipo de Treino */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Tipo de Treino
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as WorkoutType | 'ALL' }))}
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          >
            {workoutTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Período
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duração Mínima */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Duração Mínima (min)
          </label>
          <input
            type="number"
            min="0"
            value={filters.minDuration}
            onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
            placeholder="Ex: 30"
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Duração Máxima */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Duração Máxima (min)
          </label>
          <input
            type="number"
            min="0"
            value={filters.maxDuration}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
            placeholder="Ex: 120"
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Calorias Mínimas */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Flame className="w-4 h-4 inline mr-2" />
            Calorias Mínimas
          </label>
          <input
            type="number"
            min="0"
            value={filters.minCalories}
            onChange={(e) => setFilters(prev => ({ ...prev, minCalories: e.target.value }))}
            placeholder="Ex: 200"
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Calorias Máximas */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <Flame className="w-4 h-4 inline mr-2" />
            Calorias Máximas
          </label>
          <input
            type="number"
            min="0"
            value={filters.maxCalories}
            onChange={(e) => setFilters(prev => ({ ...prev, maxCalories: e.target.value }))}
            placeholder="Ex: 800"
            className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border/50">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-all duration-200 cursor-pointer"
        >
          Limpar Filtros
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Aplicar Filtros
        </button>
      </div>
    </motion.div>
  );
}
