import { PrismaClient, GoalType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar desafios para GAIN_MASS
  const gainMassChallenges = [
    {
      title: 'Treino de Força - Peito e Tríceps',
      description: 'Complete 3 séries de supino reto, 3 séries de supino inclinado e 3 séries de tríceps testa',
      goalType: GoalType.GAIN_MASS,
      points: 15,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'STRENGTH',
      isActive: true,
    },
    {
      title: 'Treino de Costas e Bíceps',
      description: 'Execute 4 séries de puxada frontal, 3 séries de remada curvada e 3 séries de rosca bíceps',
      goalType: GoalType.GAIN_MASS,
      points: 15,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'STRENGTH',
      isActive: true,
    },
    {
      title: 'Treino de Pernas Completo',
      description: 'Faça 4 séries de agachamento, 3 séries de leg press e 3 séries de panturrilha em pé',
      goalType: GoalType.GAIN_MASS,
      points: 20,
      duration: 1,
      difficulty: 'HARD',
      category: 'STRENGTH',
      isActive: true,
    },
    {
      title: 'Treino de Ombros e Trapézio',
      description: 'Complete 3 séries de desenvolvimento, 3 séries de elevação lateral e 3 séries de encolhimento',
      goalType: GoalType.GAIN_MASS,
      points: 12,
      duration: 1,
      difficulty: 'EASY',
      category: 'STRENGTH',
      isActive: true,
    },
    {
      title: 'Treino Full Body',
      description: 'Execute exercícios para todos os grupos musculares principais em uma sessão',
      goalType: GoalType.GAIN_MASS,
      points: 25,
      duration: 1,
      difficulty: 'HARD',
      category: 'STRENGTH',
      isActive: true,
    },
  ];

  // Criar desafios para LOSE_WEIGHT
  const loseWeightChallenges = [
    {
      title: 'Cardio Intenso - 30 minutos',
      description: 'Mantenha frequência cardíaca elevada por 30 minutos consecutivos',
      goalType: GoalType.LOSE_WEIGHT,
      points: 20,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'CARDIO',
      isActive: true,
    },
    {
      title: 'HIIT - 20 minutos',
      description: 'Complete 20 minutos de treino intervalado de alta intensidade',
      goalType: GoalType.LOSE_WEIGHT,
      points: 25,
      duration: 1,
      difficulty: 'HARD',
      category: 'CARDIO',
      isActive: true,
    },
    {
      title: 'Caminhada Longa',
      description: 'Caminhe por 45 minutos em ritmo moderado',
      goalType: GoalType.LOSE_WEIGHT,
      points: 15,
      duration: 1,
      difficulty: 'EASY',
      category: 'CARDIO',
      isActive: true,
    },
    {
      title: 'Treino Funcional',
      description: 'Complete um circuito funcional de 30 minutos',
      goalType: GoalType.LOSE_WEIGHT,
      points: 18,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'FUNCTIONAL',
      isActive: true,
    },
  ];

  // Criar desafios para IMPROVE_CONDITIONING
  const improveConditioningChallenges = [
    {
      title: 'Treino de Resistência',
      description: 'Complete 3 rounds de exercícios de resistência muscular',
      goalType: GoalType.IMPROVE_CONDITIONING,
      points: 15,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'ENDURANCE',
      isActive: true,
    },
    {
      title: 'Treino de Flexibilidade',
      description: 'Dedique 30 minutos para alongamento e mobilidade',
      goalType: GoalType.IMPROVE_CONDITIONING,
      points: 10,
      duration: 1,
      difficulty: 'EASY',
      category: 'FLEXIBILITY',
      isActive: true,
    },
    {
      title: 'Treino de Equilíbrio',
      description: 'Pratique exercícios de equilíbrio e coordenação por 20 minutos',
      goalType: GoalType.IMPROVE_CONDITIONING,
      points: 12,
      duration: 1,
      difficulty: 'EASY',
      category: 'BALANCE',
      isActive: true,
    },
    {
      title: 'Treino de Core',
      description: 'Foque em exercícios de core por 25 minutos',
      goalType: GoalType.IMPROVE_CONDITIONING,
      points: 15,
      duration: 1,
      difficulty: 'MEDIUM',
      category: 'CORE',
      isActive: true,
    },
  ];

  // Inserir desafios no banco
  console.log('📝 Criando desafios para GAIN_MASS...');
  for (const challenge of gainMassChallenges) {
    await prisma.challenge.upsert({
      where: { 
        title_goalType: {
          title: challenge.title,
          goalType: challenge.goalType as any,
        }
      },
      update: challenge,
      create: challenge,
    });
  }

  console.log('📝 Criando desafios para LOSE_WEIGHT...');
  for (const challenge of loseWeightChallenges) {
    await prisma.challenge.upsert({
      where: { 
        title_goalType: {
          title: challenge.title,
          goalType: challenge.goalType as any,
        }
      },
      update: challenge,
      create: challenge,
    });
  }

  console.log('📝 Criando desafios para IMPROVE_CONDITIONING...');
  for (const challenge of improveConditioningChallenges) {
    await prisma.challenge.upsert({
      where: { 
        title_goalType: {
          title: challenge.title,
          goalType: challenge.goalType as any,
        }
      },
      update: challenge,
      create: challenge,
    });
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
