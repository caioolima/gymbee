# GymBee Backend API

API backend para o sistema GymBee - Conectando usuários e personal trainers.

## 🚀 Funcionalidades

### Sprint 1 - Autenticação ✅
- [x] Cadastro de usuários comuns
- [x] Cadastro de personal trainers
- [x] Login com email e senha
- [x] Login com Google OAuth 2.0
- [x] Autenticação JWT
- [x] Validação de CPF
- [x] Criptografia de senhas com bcrypt

### Sprint 2 - Objetivos do Usuário ✅
- [x] Criação de objetivos (perder peso, ganhar massa, melhorar condicionamento)
- [x] Definição de peso atual, peso desejado e altura
- [x] Nível de atividade física
- [x] Prazo para atingir metas
- [x] Nível de experiência com treino
- [x] Cálculo automático de IMC
- [x] Acompanhamento de progresso

### Sprint 3 - Página Home ✅
- [x] Ranking de treinos por dia da semana
- [x] Sistema de votação em treinos
- [x] Mapa de academias próximas
- [x] Check-in em academias
- [x] Artigos em tendência
- [x] Desafios diários
- [x] Cálculo de distância entre usuário e academias

### Sprint 4 - Interação com Personal Trainers ✅
- [x] Sistema estilo Tinder para encontrar trainers
- [x] Filtros por localização, gênero, idade
- [x] Swipe (like/skip) em trainers
- [x] Perfil completo de trainers
- [x] Serviços ofertados pelos trainers
- [x] Agendamento de horários
- [x] Sistema de contratos
- [x] Gestão de serviços e preços

### Sprint 5 - Perfis e Análises ✅
- [x] Perfil completo do usuário
- [x] Análises de desenvolvimento no treino
- [x] Tabela de treinos semanais
- [x] Perfil do personal trainer
- [x] Número de clientes mensais
- [x] Renda mensal obtida
- [x] Horários disponíveis e ocupados
- [x] Lista de serviços ofertados

### Sprint 6 - Refinamento e Segurança ✅
- [x] Rate limiting (100 requests/minuto)
- [x] Health check endpoint
- [x] Validação global de dados
- [x] CORS configurado
- [x] Documentação Swagger/OpenAPI
- [x] Testes unitários básicos
- [x] Logs estruturados
- [x] Tratamento de erros

## 🛠️ Tecnologias

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT + Passport
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler
- **Testes**: Jest

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Docker (opcional)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd gymbee-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Com Docker
docker-compose up -d

# Ou configure manualmente o PostgreSQL
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Execute as migrações**
```bash
npx prisma migrate dev
```

6. **Gere o cliente Prisma**
```bash
npx prisma generate
```

7. **Inicie o servidor**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

Acesse a documentação interativa em: `http://localhost:8080/api/docs`

### Endpoints Principais

#### Autenticação
- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/signup/trainer` - Cadastro de trainer
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/google` - Login com Google
- `GET /api/auth/me` - Dados do usuário logado

#### Objetivos
- `POST /api/users/goals` - Criar objetivo
- `GET /api/users/goals` - Listar objetivos
- `GET /api/users/goals/active` - Objetivo ativo
- `PUT /api/users/goals/:id` - Atualizar objetivo
- `DELETE /api/users/goals/:id` - Deletar objetivo

#### Home
- `GET /api/home` - Dados da página inicial
- `GET /api/home/ranking` - Ranking de treinos
- `GET /api/home/gyms` - Academias próximas
- `POST /api/home/gyms/checkin` - Check-in em academia
- `GET /api/home/trends` - Artigos em tendência
- `GET /api/home/challenges` - Desafios diários

#### Trainers
- `GET /api/trainers` - Listar trainers (com filtros)
- `POST /api/trainers/swipe` - Dar swipe em trainer
- `GET /api/trainers/:id` - Perfil do trainer
- `POST /api/trainers/:id/contract` - Contratar trainer
- `GET /api/trainers/contracts/my` - Meus contratos

#### Perfis
- `GET /api/profiles/user` - Perfil do usuário
- `GET /api/profiles/user/analytics` - Análises do usuário
- `GET /api/profiles/trainer/:id` - Perfil do trainer
- `GET /api/profiles/trainer/:id/analytics` - Análises do trainer

#### Health Check
- `GET /api/health` - Status da aplicação

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 🐳 Docker

```bash
# Subir apenas o banco
docker-compose up -d db

# Subir tudo
docker-compose up -d
```

## 📊 Estrutura do Banco

### Principais Tabelas
- `User` - Usuários do sistema
- `Trainer` - Personal trainers
- `UserGoal` - Objetivos dos usuários
- `Service` - Serviços dos trainers
- `Schedule` - Horários disponíveis
- `TrainerSwipe` - Swipes dos usuários
- `Contract` - Contratos entre usuários e trainers
- `Gym` - Academias
- `GymCheckIn` - Check-ins em academias
- `WorkoutRanking` - Ranking de treinos
- `Article` - Artigos
- `Challenge` - Desafios diários

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- JWT para autenticação
- Rate limiting (100 req/min)
- Validação de dados de entrada
- CORS configurado
- Headers de segurança

## 📈 Monitoramento

- Health check endpoint
- Logs estruturados
- Tratamento de erros
- Métricas de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, entre em contato através dos issues do GitHub.