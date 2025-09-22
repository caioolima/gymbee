'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Dumbbell, Activity, Zap, Target, Clock, Trash2, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { WorkoutType, CreateWorkoutRequest, Exercise } from '@/types/workouts';
import { useWorkouts } from '@/hooks/useWorkoutsQuery';
import { CustomWorkoutDialog } from './CustomWorkoutDialog';
import { ReuseWorkoutDialog } from './ReuseWorkoutDialog';

interface WeeklyPlanningModalProps {
    currentWeek: Date;
    selectedDate?: Date; // Data real do dia selecionado
    onClose: () => void;
}

interface PlannedWorkout {
    id: string;
    type: WorkoutType;
    name: string;
    duration: number;
    day: number; // 0 = segunda, 1 = terça, etc.
    selectedDate: Date; // Data real do dia selecionado
    source: 'template' | 'user-created'; // Origem do treino
    originalWorkoutId?: string; // ID do treino original (para reutilizados)
    exercises?: Exercise[]; // Exercícios do treino
}

interface WorkoutTemplate {
    type: WorkoutType;
    name: string;
    duration: number;
    exercises: Exercise[];
}

export function WeeklyPlanningModal({ currentWeek, selectedDate, onClose }: WeeklyPlanningModalProps) {
    const { createWorkout, isCreating, workouts } = useWorkouts();
    const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCustomDialog, setShowCustomDialog] = useState(false);
    const [showReuseDialog, setShowReuseDialog] = useState(false);

    const daysOfWeek = [
        'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
    ];

    const workoutTypes = [
        { value: WorkoutType.STRENGTH, label: 'Força', icon: Dumbbell, color: 'from-red-500 to-red-600' },
        { value: WorkoutType.CARDIO, label: 'Cardio', icon: Activity, color: 'from-blue-500 to-blue-600' },
        { value: WorkoutType.FLEXIBILITY, label: 'Flexibilidade', icon: Zap, color: 'from-green-500 to-green-600' },
        { value: WorkoutType.MIXED, label: 'Misto', icon: Target, color: 'from-purple-500 to-purple-600' },
    ];

    const workoutTemplates: WorkoutTemplate[] = [
        { 
            type: WorkoutType.STRENGTH, 
            name: 'Treino de Peito e Tríceps', 
            duration: 60,
            exercises: [
                { name: 'Supino Reto', sets: 4, reps: '8-12', weight: 0 },
                { name: 'Supino Inclinado', sets: 3, reps: '10-12', weight: 0 },
                { name: 'Crucifixo', sets: 3, reps: '12-15', weight: 0 },
                { name: 'Tríceps Pulley', sets: 4, reps: '12-15', weight: 0 },
                { name: 'Tríceps Testa', sets: 3, reps: '10-12', weight: 0 },
                { name: 'Mergulho', sets: 3, reps: '8-12', weight: 0 }
            ]
        },
        { 
            type: WorkoutType.STRENGTH, 
            name: 'Treino de Costas e Bíceps', 
            duration: 60,
            exercises: [
                { name: 'Puxada Frontal', sets: 4, reps: '8-12', weight: 0 },
                { name: 'Remada Curvada', sets: 4, reps: '8-12', weight: 0 },
                { name: 'Puxada Alta', sets: 3, reps: '10-12', weight: 0 },
                { name: 'Rosca Direta', sets: 4, reps: '10-12', weight: 0 },
                { name: 'Rosca Martelo', sets: 3, reps: '12-15', weight: 0 },
                { name: 'Rosca Concentrada', sets: 3, reps: '10-12', weight: 0 }
            ]
        },
        { 
            type: WorkoutType.STRENGTH, 
            name: 'Treino de Pernas', 
            duration: 75,
            exercises: [
                { name: 'Agachamento Livre', sets: 4, reps: '8-12', weight: 0 },
                { name: 'Leg Press', sets: 4, reps: '12-15', weight: 0 },
                { name: 'Stiff', sets: 3, reps: '10-12', weight: 0 },
                { name: 'Cadeira Extensora', sets: 3, reps: '12-15', weight: 0 },
                { name: 'Cadeira Flexora', sets: 3, reps: '12-15', weight: 0 },
                { name: 'Panturrilha em Pé', sets: 4, reps: '15-20', weight: 0 },
                { name: 'Panturrilha Sentado', sets: 3, reps: '15-20', weight: 0 }
            ]
        },
        { 
            type: WorkoutType.CARDIO, 
            name: 'Corrida', 
            duration: 30,
            exercises: [
                { name: 'Aquecimento', sets: 1, reps: '5min', duration: 5 },
                { name: 'Corrida Moderada', sets: 1, reps: '20min', duration: 20 },
                { name: 'Caminhada', sets: 1, reps: '5min', duration: 5 }
            ]
        },
        { 
            type: WorkoutType.CARDIO, 
            name: 'HIIT', 
            duration: 25,
            exercises: [
                { name: 'Burpees', sets: 4, reps: '30s', duration: 30, rest: 30 },
                { name: 'Mountain Climbers', sets: 4, reps: '30s', duration: 30, rest: 30 },
                { name: 'Jumping Jacks', sets: 4, reps: '30s', duration: 30, rest: 30 },
                { name: 'Polichinelo', sets: 4, reps: '30s', duration: 30, rest: 30 },
                { name: 'Prancha', sets: 4, reps: '30s', duration: 30, rest: 30 }
            ]
        },
        { 
            type: WorkoutType.FLEXIBILITY, 
            name: 'Yoga', 
            duration: 45,
            exercises: [
                { name: 'Respiração Profunda', sets: 1, reps: '5min', duration: 5 },
                { name: 'Saudação ao Sol', sets: 3, reps: '5min', duration: 15 },
                { name: 'Postura da Árvore', sets: 2, reps: '1min', duration: 2 },
                { name: 'Postura do Guerreiro', sets: 2, reps: '1min', duration: 2 },
                { name: 'Postura da Criança', sets: 1, reps: '3min', duration: 3 },
                { name: 'Meditação Final', sets: 1, reps: '10min', duration: 10 }
            ]
        },
        { 
            type: WorkoutType.MIXED, 
            name: 'Treino Funcional', 
            duration: 50,
            exercises: [
                { name: 'Agachamento com Salto', sets: 3, reps: '15', weight: 0 },
                { name: 'Flexão de Braço', sets: 3, reps: '12-15', weight: 0 },
                { name: 'Prancha Lateral', sets: 2, reps: '30s', duration: 30 },
                { name: 'Lunges', sets: 3, reps: '12 cada perna', weight: 0 },
                { name: 'Burpees', sets: 3, reps: '10', weight: 0 },
                { name: 'Mountain Climbers', sets: 3, reps: '20', weight: 0 },
                { name: 'Prancha', sets: 3, reps: '45s', duration: 45 }
            ]
        },
    ];
    function getDateForDay(currentWeek: Date, dayIndex: number) {
        // currentWeek já é sempre o início da semana (segunda-feira)
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + dayIndex);
        return targetDate;
    }


    const addWorkout = (day: number, template?: WorkoutTemplate) => {
        console.log('=== ADD WORKOUT ===');
        console.log('Day:', day);
        console.log('Selected date from props:', selectedDate?.toLocaleDateString('pt-BR'));

        // SIMPLES: Usar a data que você selecionou, sem calcular porra nenhuma!
        const workoutDate = getDateForDay(currentWeek, day);
        console.log('Workout date:', workoutDate.toLocaleDateString('pt-BR'));

        const newWorkout: PlannedWorkout = {
            id: Math.random().toString(36).substr(2, 9),
            type: template?.type || WorkoutType.STRENGTH,
            name: template?.name || 'Novo Treino',
            duration: template?.duration || 60,
            day: day,
            selectedDate: workoutDate,
            source: 'template',
        };

        console.log('New workout:', newWorkout);

        setPlannedWorkouts(prev => [...prev, newWorkout]);
        setShowAddModal(false);
    };

    const handleCustomWorkoutCreated = (workout: any) => {
        if (selectedDay === null) return;
        
        const workoutDate = getDateForDay(currentWeek, selectedDay);
        
        const newWorkout: PlannedWorkout = {
            id: Math.random().toString(36).substr(2, 9),
            type: workout.type,
            name: workout.name,
            duration: workout.duration,
            day: selectedDay,
            selectedDate: workoutDate,
            source: 'user-created', // Treino customizado é user-created
            exercises: workout.exercises || [], // Armazenar exercícios do treino customizado
        };

        setPlannedWorkouts(prev => [...prev, newWorkout]);
    };

    const handleReuseWorkout = (workout: any) => {
        if (selectedDay === null) return;
        
        const workoutDate = getDateForDay(currentWeek, selectedDay);
        
        const newWorkout: PlannedWorkout = {
            id: Math.random().toString(36).substr(2, 9),
            type: workout.type,
            name: workout.name,
            duration: workout.duration,
            day: selectedDay,
            selectedDate: workoutDate,
            source: 'user-created', // Treino reutilizado é sempre user-created
            originalWorkoutId: workout.id,
        };

        setPlannedWorkouts(prev => [...prev, newWorkout]);
        setShowReuseDialog(false);
    };


    const removeWorkout = (id: string) => {
        setPlannedWorkouts(prev => prev.filter(w => w.id !== id));
    };

    const getWorkoutsForDay = (day: number) => {
        return plannedWorkouts.filter(w => w.day === day);
    };

    const getWorkoutTypeIcon = (type: WorkoutType) => {
        const workoutType = workoutTypes.find(t => t.value === type);
        return workoutType?.icon || Dumbbell;
    };

    const getWorkoutTypeColor = (type: WorkoutType) => {
        const workoutType = workoutTypes.find(t => t.value === type);
        return workoutType?.color || 'from-gray-500 to-gray-600';
    };

    const saveWeeklyPlan = async () => {
        console.log('=== SAVE WEEKLY PLAN ===');
        console.log('Current week:', currentWeek.toLocaleDateString('pt-BR'));
        console.log('Planned workouts:', plannedWorkouts);

        // Criar todos os treinos planejados
        for (const workout of plannedWorkouts) {
            // Usar a data real que foi calculada quando o treino foi adicionado
            const workoutDate = new Date(workout.selectedDate);
            workoutDate.setHours(9, 0, 0, 0); // 9:00 AM

            console.log(`Criando treino: ${workout.name} (${workout.source})`);
            console.log(`Dia da semana: ${workout.day} (${daysOfWeek[workout.day]})`);
            console.log(`Data selecionada: ${workout.selectedDate.toLocaleDateString('pt-BR')}`);
            console.log(`Data final: ${workoutDate.toLocaleDateString('pt-BR')}`);
            console.log(`Data ISO: ${workoutDate.toISOString()}`);

            let workoutData: any = {
                type: workout.type as string,
                name: workout.name,
                duration: workout.duration,
                scheduledDate: workoutDate.toISOString(),
                source: workout.source, // Enviar o source exato: 'template' ou 'user-created'
            };

            // Tratar cada tipo de treino de forma diferente
            if (workout.source === 'template') {
                // Para templates, usar os exercícios pré-definidos
                const template = workoutTemplates.find(t => 
                    t.name === workout.name && 
                    t.type === workout.type && 
                    t.duration === workout.duration
                );
                workoutData.exercises = template?.exercises || [];
            } else if (workout.source === 'user-created') {
                // Para treinos user-created (customizados ou reutilizados), usar os exercícios armazenados
                if (workout.originalWorkoutId) {
                    // Treino reutilizado - buscar exercícios do treino original
                    const originalWorkout = workouts?.find(w => w.id === workout.originalWorkoutId);
                    workoutData.exercises = originalWorkout?.exercises || [];
                } else {
                    // Treino customizado - usar exercícios armazenados
                    workoutData.exercises = workout.exercises || [];
                }
            }

            console.log('Workout data sendo enviado:', workoutData);
            console.log('Source do treino:', workout.source);
            console.log('Source sendo enviado:', workoutData.source);

            // Enviar para o backend
            createWorkout(workoutData);
        }

        onClose();
    };

    const clearWeek = () => {
        setPlannedWorkouts([]);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Planejar Semana</h2>
                        <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Organize seus treinos para a semana toda
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-foreground hover:bg-input-bg rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-4 mb-6">
                    {daysOfWeek.map((day, index) => {
                        const dayWorkouts = getWorkoutsForDay(index);
                        const today = new Date();
                        const dayDate = getDateForDay(currentWeek, index);
                        const isToday = today.toDateString() === dayDate.toDateString();

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-gradient-to-br from-input-bg/50 to-input-bg/30 rounded-xl p-4 border-2 transition-all duration-200 ${isToday
                                        ? 'border-accent/50 bg-accent/5'
                                        : 'border-border/30 hover:border-accent/30'
                                    }`}
                            >
                                {/* Day Header */}
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-foreground text-sm">{day}</h3>
                                    <p className="text-xs text-text-muted">
                                        {getDateForDay(currentWeek, index).getDate()}/{getDateForDay(currentWeek, index).getMonth() + 1}
                                    </p>
                                </div>

                                {/* Workouts List */}
                                <div className="space-y-2 min-h-[120px]">
                                    {dayWorkouts.map((workout) => {
                                        const Icon = getWorkoutTypeIcon(workout.type);
                                        const color = getWorkoutTypeColor(workout.type);

                                        return (
                                            <motion.div
                                                key={workout.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className={`bg-gradient-to-r ${color} text-white rounded-lg p-3 relative group`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Icon className="w-4 h-4" />
                                                    <span className="font-semibold text-xs truncate">{workout.name}</span>
                                                    {/* Indicador de origem */}
                                                    <div className="ml-auto">
                                                        {workout.source === 'template' && (
                                                            <div className="w-2 h-2 bg-white/60 rounded-full" title="Template pronto" />
                                                        )}
                                                        {workout.source === 'user-created' && (
                                                            <div className="w-2 h-2 bg-yellow-300 rounded-full" title="Treino criado pelo usuário" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs opacity-90">
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {workout.duration}min
                                                    </span>
                                                    <button
                                                        onClick={() => removeWorkout(workout.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Add Workout Button */}
                                <button
                                    onClick={() => {
                                        setSelectedDay(index);
                                        setShowAddModal(true);
                                    }}
                                    className={`w-full mt-3 p-2 border-2 border-dashed rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${selectedDay === index
                                            ? 'border-accent bg-accent/10 text-accent'
                                            : 'border-border/50 text-text-muted hover:border-accent/50 hover:text-accent'
                                        }`}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-xs">
                                        {selectedDay === index ? 'Selecionado' : 'Adicionar'}
                                    </span>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Templates Section - Só aparece quando um dia está selecionado */}
                {selectedDay !== null && (
                    <div className="bg-gradient-to-br from-input-bg/30 to-input-bg/10 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Dumbbell className="w-4 h-4" />
                            Adicionar treino para {daysOfWeek[selectedDay]}
                        </h3>

                        {/* Opções de Treino */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => setShowCustomDialog(true)}
                                className="p-4 border-2 border-dashed border-accent/50 text-accent hover:bg-accent/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-accent/20 to-yellow-300/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">Criar Novo</div>
                                    <div className="text-xs text-text-muted">Treino personalizado</div>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => setShowReuseDialog(true)}
                                className="p-4 border-2 border-dashed border-blue-500/50 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">Reutilizar</div>
                                    <div className="text-xs text-text-muted">Treino existente</div>
                                </div>
                            </button>
                        </div>


                        {/* Templates */}
                        <div>
                            <h4 className="font-semibold text-foreground mb-3">Templates Prontos</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {workoutTemplates.map((template, index) => {
                                    const Icon = getWorkoutTypeIcon(template.type);
                                    const color = getWorkoutTypeColor(template.type);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => addWorkout(selectedDay, template)}
                                            className="p-3 rounded-lg border border-border/30 hover:border-accent/50 transition-all duration-200 text-left group cursor-pointer"
                                        >
                                            <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <h4 className="font-medium text-foreground text-xs mb-1">{template.name}</h4>
                                            <p className="text-text-muted text-xs">{template.duration}min</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-4">
                    <button
                        onClick={clearWeek}
                        className="px-4 py-2 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-lg transition-all duration-200 cursor-pointer font-medium flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Limpar Semana
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-transparent border border-border/50 text-text-muted hover:text-foreground hover:bg-input-bg/50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveWeeklyPlan}
                            disabled={plannedWorkouts.length === 0}
                            className="px-6 py-2 bg-gradient-to-r from-accent to-yellow-300 hover:from-accent/90 hover:to-yellow-300/90 disabled:from-accent/50 disabled:to-yellow-300/50 text-black font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Plano ({plannedWorkouts.length} treinos)
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Custom Workout Dialog */}
            {selectedDay !== null && (
                <CustomWorkoutDialog
                    isOpen={showCustomDialog}
                    onClose={() => setShowCustomDialog(false)}
                    selectedDate={getDateForDay(currentWeek, selectedDay)}
                    onWorkoutCreated={handleCustomWorkoutCreated}
                />
            )}

            {/* Reuse Workout Dialog */}
            {showReuseDialog && selectedDay !== null && (
                <ReuseWorkoutDialog
                    isOpen={showReuseDialog}
                    onClose={() => setShowReuseDialog(false)}
                    workouts={workouts || []}
                    onSelectWorkout={handleReuseWorkout}
                />
            )}
        </div>
    );
}
