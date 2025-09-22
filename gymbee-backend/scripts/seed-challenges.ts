import { PrismaClient, GoalType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChallenges() {
  console.log('🌱 Iniciando seed de desafios...');

  const challenges = [
    // Desafios para GANHAR MASSA
    {
      title: 'Treino de Força 3x por Semana',
      description: 'Complete 3 treinos de força por semana durante 4 semanas',
      goalType: 'GAIN_MASS' as GoalType,
      points: 50,
    },
    {
      title: 'Aumentar Peso nos Exercícios',
      description: 'Aumente o peso em pelo menos 3 exercícios principais',
      goalType: 'GAIN_MASS' as GoalType,
      points: 30,
    },
    {
      title: 'Consumir 2g de Proteína por kg',
      description: 'Mantenha a ingestão de proteína por 7 dias consecutivos',
      goalType: 'GAIN_MASS' as GoalType,
      points: 40,
    },
    {
      title: 'Ganhar 1kg de Peso',
      description: 'Aumente seu peso corporal em 1kg',
      goalType: 'GAIN_MASS' as GoalType,
      points: 60,
    },
    {
      title: 'Treino de Hipertrofia',
      description: 'Complete 4 treinos focados em hipertrofia por semana',
      goalType: 'GAIN_MASS' as GoalType,
      points: 45,
    },

    // Desafios para PERDER PESO
    {
      title: 'Cardio 4x por Semana',
      description: 'Complete 4 sessões de cardio por semana durante 4 semanas',
      goalType: 'LOSE_WEIGHT' as GoalType,
      points: 50,
    },
    {
      title: 'Deficit Calórico de 500kcal',
      description: 'Mantenha deficit calórico de 500kcal por 7 dias',
      goalType: 'LOSE_WEIGHT' as GoalType,
      points: 40,
    },
    {
      title: 'Perder 2kg de Peso',
      description: 'Reduza seu peso corporal em 2kg',
      goalType: 'LOSE_WEIGHT' as GoalType,
      points: 60,
    },
    {
      title: '10.000 Passos Diários',
      description: 'Caminhe 10.000 passos por 7 dias consecutivos',
      goalType: 'LOSE_WEIGHT' as GoalType,
      points: 35,
    },
    {
      title: 'Jejum Intermitente',
      description: 'Pratique jejum intermitente por 5 dias',
      goalType: 'LOSE_WEIGHT' as GoalType,
      points: 30,
    },

    // Desafios para MELHORAR CONDICIONAMENTO
    {
      title: 'Treino HIIT 3x por Semana',
      description: 'Complete 3 treinos HIIT por semana durante 4 semanas',
      goalType: 'IMPROVE_CONDITIONING' as GoalType,
      points: 45,
    },
    {
      title: 'Corrida de 5km',
      description: 'Complete uma corrida de 5km sem parar',
      goalType: 'IMPROVE_CONDITIONING' as GoalType,
      points: 40,
    },
    {
      title: 'Flexibilidade Diária',
      description: 'Faça alongamentos por 10 minutos por 14 dias',
      goalType: 'IMPROVE_CONDITIONING' as GoalType,
      points: 30,
    },
    {
      title: 'Melhorar Tempo de Corrida',
      description: 'Reduza seu tempo de corrida de 5km em 2 minutos',
      goalType: 'IMPROVE_CONDITIONING' as GoalType,
      points: 50,
    },
    {
      title: 'Treino Funcional',
      description: 'Complete 3 treinos funcionais por semana',
      goalType: 'IMPROVE_CONDITIONING' as GoalType,
      points: 35,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: {
        title_goalType: {
          title: challenge.title,
          goalType: challenge.goalType,
        },
      },
      update: {
        ...challenge,
        duration: 7,
        difficulty: 'MEDIUM',
        category: 'GENERAL',
      },
      create: {
        ...challenge,
        duration: 7,
        difficulty: 'MEDIUM',
        category: 'GENERAL',
      },
    });
  }

  console.log(`✅ ${challenges.length} desafios seedados com sucesso!`);
}

async function main() {
  try {
    await seedChallenges();
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
