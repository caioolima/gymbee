import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearUserDailyChallenges() {
  try {
    console.log('🗑️ Limpando desafios diários do usuário...');

    // Buscar o usuário teste
    const user = await prisma.user.findFirst({
      where: {
        email: 'teste@gymbee.com'
      }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log(`👤 Usuário encontrado: ${user.fullName} (${user.email})`);

    // Contar desafios diários antes da limpeza
    const beforeCount = await (prisma as any).dailyChallenge.count({
      where: { userId: user.id }
    });

    console.log(`📊 Desafios diários encontrados: ${beforeCount}`);

    if (beforeCount === 0) {
      console.log('✅ Nenhum desafio diário para limpar');
      return;
    }

    // Apagar todos os desafios diários do usuário
    const deletedChallenges = await (prisma as any).dailyChallenge.deleteMany({
      where: { userId: user.id }
    });

    console.log(`✅ ${deletedChallenges.count} desafios diários removidos`);

    // Verificar se foi limpo
    const afterCount = await (prisma as any).dailyChallenge.count({
      where: { userId: user.id }
    });

    console.log(`📊 Desafios diários restantes: ${afterCount}`);

    if (afterCount === 0) {
      console.log('🎉 Todos os desafios diários foram removidos com sucesso!');
    } else {
      console.log('⚠️ Ainda existem desafios diários no banco');
    }

  } catch (error) {
    console.error('❌ Erro ao limpar desafios diários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUserDailyChallenges();
