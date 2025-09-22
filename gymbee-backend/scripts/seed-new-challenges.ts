import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newChallenges = [
  // DESAFIOS DE GANHO DE MASSA - APENAS TREINOS
  {
    title: 'Treino de Força 3x por Semana',
    description: 'Complete 3 treinos de força por semana durante 4 semanas',
    goalType: 'GAIN_MASS',
    points: 50,
    duration: 28,
    difficulty: 'MEDIUM',
    category: 'TREINO'
  },
  {
    title: 'Aumentar Peso nos Exercícios',
    description: 'Aumente o peso em pelo menos 3 exercícios principais',
    goalType: 'GAIN_MASS',
    points: 30,
    duration: 14,
    difficulty: 'EASY',
    category: 'PROGRESSO'
  },
  {
    title: 'Treino de Hipertrofia',
    description: 'Complete 4 treinos focados em hipertrofia por semana',
    goalType: 'GAIN_MASS',
    points: 45,
    duration: 21,
    difficulty: 'HARD',
    category: 'TREINO'
  },
  {
    title: 'Supino 100kg',
    description: 'Execute 1 repetição no supino com 100kg',
    goalType: 'GAIN_MASS',
    points: 80,
    duration: 60,
    difficulty: 'HARD',
    category: 'META'
  },
  {
    title: 'Agachamento 150kg',
    description: 'Execute 1 repetição no agachamento com 150kg',
    goalType: 'GAIN_MASS',
    points: 90,
    duration: 90,
    difficulty: 'HARD',
    category: 'META'
  },
  {
    title: 'Levantamento Terra 200kg',
    description: 'Execute 1 repetição no levantamento terra com 200kg',
    goalType: 'GAIN_MASS',
    points: 100,
    duration: 120,
    difficulty: 'HARD',
    category: 'META'
  },

  // DESAFIOS DE PERDA DE PESO - APENAS TREINOS
  {
    title: 'Cardio 4x por Semana',
    description: 'Complete 4 sessões de cardio por semana durante 4 semanas',
    goalType: 'LOSE_WEIGHT',
    points: 50,
    duration: 28,
    difficulty: 'MEDIUM',
    category: 'CARDIO'
  },
  {
    title: 'HIIT 3x por Semana',
    description: 'Complete 3 treinos HIIT por semana',
    goalType: 'LOSE_WEIGHT',
    points: 40,
    duration: 21,
    difficulty: 'HARD',
    category: 'CARDIO'
  },
  {
    title: '10.000 Passos Diários',
    description: 'Caminhe 10.000 passos por 7 dias consecutivos',
    goalType: 'LOSE_WEIGHT',
    points: 25,
    duration: 7,
    difficulty: 'EASY',
    category: 'ATIVIDADE'
  },
  {
    title: 'Plank 5 Minutos',
    description: 'Execute 5 minutos de plank em uma única sessão',
    goalType: 'LOSE_WEIGHT',
    points: 30,
    duration: 14,
    difficulty: 'HARD',
    category: 'FORÇA'
  },
  {
    title: 'Corrida 5km',
    description: 'Complete uma corrida de 5km sem parar',
    goalType: 'LOSE_WEIGHT',
    points: 40,
    duration: 21,
    difficulty: 'MEDIUM',
    category: 'CARDIO'
  },
  {
    title: 'Bicicleta 20km',
    description: 'Pedale 20km em uma única sessão',
    goalType: 'LOSE_WEIGHT',
    points: 35,
    duration: 14,
    difficulty: 'MEDIUM',
    category: 'CARDIO'
  },

  // DESAFIOS DE CONDICIONAMENTO - APENAS TREINOS
  {
    title: 'Flexões 100 por Dia',
    description: 'Execute 100 flexões por dia durante 7 dias',
    goalType: 'IMPROVE_CONDITIONING',
    points: 35,
    duration: 7,
    difficulty: 'HARD',
    category: 'FORÇA'
  },
  {
    title: 'Yoga 5x por Semana',
    description: 'Pratique yoga 5 vezes por semana',
    goalType: 'IMPROVE_CONDITIONING',
    points: 30,
    duration: 14,
    difficulty: 'MEDIUM',
    category: 'FLEXIBILIDADE'
  },
  {
    title: 'Natação 1km',
    description: 'Nade 1km sem parar',
    goalType: 'IMPROVE_CONDITIONING',
    points: 45,
    duration: 30,
    difficulty: 'HARD',
    category: 'CARDIO'
  },
  {
    title: 'Burpees 50 por Dia',
    description: 'Execute 50 burpees por dia durante 10 dias',
    goalType: 'IMPROVE_CONDITIONING',
    points: 40,
    duration: 10,
    difficulty: 'HARD',
    category: 'FUNCIONAL'
  },
  {
    title: 'Pular Corda 10 Minutos',
    description: 'Pule corda por 10 minutos sem parar',
    goalType: 'IMPROVE_CONDITIONING',
    points: 25,
    duration: 7,
    difficulty: 'MEDIUM',
    category: 'CARDIO'
  },
  {
    title: 'Musculação 5x por Semana',
    description: 'Faça musculação 5 vezes por semana',
    goalType: 'IMPROVE_CONDITIONING',
    points: 50,
    duration: 28,
    difficulty: 'HARD',
    category: 'TREINO'
  }
];

async function seedNewChallenges() {
  try {
    console.log('🌱 Criando novos desafios...');
    
    for (const challenge of newChallenges) {
      await prisma.challenge.upsert({
        where: {
          title_goalType: {
            title: challenge.title,
            goalType: challenge.goalType as any
          }
        },
        update: {
          title: challenge.title,
          description: challenge.description,
          goalType: challenge.goalType as any,
          points: challenge.points,
          duration: challenge.duration,
          difficulty: challenge.difficulty,
          category: challenge.category
        },
        create: {
          title: challenge.title,
          description: challenge.description,
          goalType: challenge.goalType as any,
          points: challenge.points,
          duration: challenge.duration,
          difficulty: challenge.difficulty,
          category: challenge.category
        }
      });
      console.log(`✅ Desafio criado: ${challenge.title}`);
    }
    
    console.log(`\n🎉 ${newChallenges.length} desafios criados com sucesso!`);
    
    // Mostrar resumo por categoria
    const gainMass = newChallenges.filter(c => c.goalType === 'GAIN_MASS').length;
    const loseWeight = newChallenges.filter(c => c.goalType === 'LOSE_WEIGHT').length;
    const conditioning = newChallenges.filter(c => c.goalType === 'IMPROVE_CONDITIONING').length;
    
    console.log('\n📊 Resumo por categoria:');
    console.log(`   - Ganho de Massa: ${gainMass} desafios`);
    console.log(`   - Perda de Peso: ${loseWeight} desafios`);
    console.log(`   - Condicionamento: ${conditioning} desafios`);
    
  } catch (error) {
    console.error('❌ Erro ao criar desafios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNewChallenges();
