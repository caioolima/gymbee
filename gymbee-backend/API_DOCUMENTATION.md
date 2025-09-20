# GymBee Backend API - Sprint 1

## 🚀 Funcionalidades Implementadas

### ✅ Sprint 1 - Cadastro e Login (COMPLETO)

- ✅ Cadastro de usuários (membros)
- ✅ Cadastro de personal trainers
- ✅ Login com email e senha
- ✅ Login com Google OAuth 2.0
- ✅ Autenticação JWT
- ✅ Rota para dados do usuário autenticado
- ✅ Criptografia de senhas com bcrypt
- ✅ Validação de CPF
- ✅ Documentação Swagger

## 📋 Endpoints Disponíveis

### Autenticação

#### 1. Cadastro de Membro
```http
POST /auth/register-user
Content-Type: application/json

{
  "fullName": "João da Silva",
  "username": "joaosilva",
  "birthDate": "1990-05-15",
  "email": "joao@email.com",
  "password": "minhasenha123",
  "gender": "M",
  "cpf": "12345678901"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "fullName": "João da Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "role": "USER"
  }
}
```

#### 2. Cadastro de Personal Trainer
```http
POST /auth/register-trainer
Content-Type: application/json

{
  "fullName": "Maria Santos",
  "username": "mariasantos",
  "birthDate": "1985-08-20",
  "email": "maria@email.com",
  "password": "minhasenha123",
  "gender": "F",
  "cpf": "98765432100",
  "cref": "123456-G/SP"
}
```

#### 3. Login com Email e Senha
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

#### 4. Login com Google OAuth
```http
POST /auth/google
Content-Type: application/json

{
  "accessToken": "ya29.a0AfH6SMC..."
}
```

#### 5. Obter Dados do Usuário Autenticado
```http
GET /auth/me
Authorization: Bearer <seu-jwt-token>
```

#### 6. Listar Todos os Usuários
```http
GET /auth/users
```

#### 7. Buscar Usuário por ID
```http
GET /auth/users/:id
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gymbee_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Server
PORT=3000
NODE_ENV="development"
```

### 2. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar migrações do Prisma
npx prisma migrate dev

# Executar em modo desenvolvimento
npm run start:dev

# Executar em modo produção
npm run build
npm run start:prod
```

### 3. Documentação Swagger

Acesse a documentação interativa da API em:
```
http://localhost:3000/api/docs
```

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt (salt rounds: 10)
- ✅ Tokens JWT com expiração de 1 hora
- ✅ Validação de CPF brasileiro
- ✅ Middleware de autenticação JWT
- ✅ Validação de dados com class-validator

## 📊 Banco de Dados

### Modelos Prisma

```prisma
model User {
  id           String   @id @default(uuid())
  fullName     String
  username     String   @unique
  birthDate    DateTime
  email        String   @unique
  passwordHash String
  gender       String
  role         Role
  cpf          String  @unique
  trainer      Trainer?
  createdAt    DateTime @default(now())
}

model Trainer {
  id     String @id @default(uuid())
  cref   String @unique
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  TRAINER
}
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📝 Próximas Sprints

- **Sprint 2**: Objetivos do Usuário
- **Sprint 3**: Página Home
- **Sprint 4**: Interação com Personal Trainer
- **Sprint 5**: Perfis e Análises
- **Sprint 6**: Refinamento e Requisitos Não Funcionais

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no DATABASE_URL

### Erro de JWT
- Verifique se JWT_SECRET está definido
- Confirme se o token não expirou

### Erro de Google OAuth
- Verifique se GOOGLE_CLIENT_ID está correto
- Confirme se o token do Google é válido



