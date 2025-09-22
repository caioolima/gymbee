import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    validateCustomDecorators: true,
    disableErrorMessages: false,
  }));

  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('GymBee API')
    .setDescription('API do sistema GymBee - Conectando usuários e personal trainers')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Autenticação', 'Endpoints para login, registro e autenticação')
    .addTag('Objetivos do Usuário', 'Gerenciamento de objetivos e metas dos usuários')
    .addTag('Página Home', 'Funcionalidades da página inicial')
    .addTag('Personal Trainers', 'Sistema de interação com personal trainers')
    .addTag('Perfis e Análises', 'Perfis e análises de usuários e trainers')
    .addTag('Health Check', 'Verificação de saúde da aplicação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Configurar prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8080;
  await app.listen(port);
  
  console.log(`🚀 GymBee API rodando na porta ${port}`);
  console.log(`📚 Documentação disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
