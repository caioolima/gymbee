# Integração Frontend com Backend - GymBee

## 🚀 Configuração da Integração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Estrutura Implementada

#### 📁 Tipos TypeScript (`src/types/auth.ts`)
- `RegisterUserRequest`: Interface para cadastro de membros
- `RegisterTrainerRequest`: Interface para cadastro de personal trainers
- `AuthResponse`: Resposta da API de autenticação
- `ApiError`: Interface para erros da API

#### 🔧 Serviço de API (`src/services/api.ts`)
- `ApiService`: Classe para comunicação com o backend
- Métodos implementados:
  - `registerUser()`: Cadastro de membros
  - `registerTrainer()`: Cadastro de personal trainers
  - `login()`: Login com email e senha
  - `getCurrentUser()`: Obter dados do usuário autenticado

#### 🎣 Hook de Autenticação (`src/hooks/useAuth.ts`)
- `useAuth`: Hook para gerenciar estado de autenticação
- `AuthProvider`: Provider para contexto de autenticação
- Funcionalidades:
  - Gerenciamento de token JWT
  - Persistência no localStorage
  - Estado de loading e erros
  - Métodos de login, registro e logout

#### 🎨 Componentes Atualizados

##### Formulário de Membro (`MemberRegisterForm.tsx`)
- ✅ Integração com API de cadastro
- ✅ Validação de formulário
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Campos: email, nome, username, senha, CPF, gênero

##### Formulário de Personal Trainer (`TrainerRegisterForm.tsx`)
- ✅ Integração com API de cadastro
- ✅ Validação de formulário
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Campos: email, nome, username, senha, CPF, CREF, gênero

##### Layout Principal (`layout.tsx`)
- ✅ AuthProvider configurado
- ✅ Contexto de autenticação disponível globalmente

### 3. Fluxo de Cadastro

1. **Seleção de Tipo**: Usuário escolhe entre "Membro" ou "Personal Trainer"
2. **Formulário**: Preenchimento dos dados básicos
3. **Validação**: Validação client-side dos campos
4. **API Call**: Envio dos dados para o backend
5. **Data de Nascimento**: Coleta da data de nascimento (opcional)
6. **Redirecionamento**: Usuário é redirecionado para o dashboard

### 4. Endpoints Utilizados

#### Cadastro de Membro
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

#### Cadastro de Personal Trainer
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

### 5. Tratamento de Erros

- **Validação Client-side**: Validação em tempo real dos campos
- **Erros de API**: Exibição de mensagens de erro do backend
- **Estados de Loading**: Feedback visual durante requisições
- **Formatação**: Formatação automática de CPF e CREF

### 6. Segurança

- ✅ Senhas não são armazenadas no localStorage
- ✅ Token JWT é armazenado de forma segura
- ✅ Validação de dados no frontend e backend
- ✅ Formatação e sanitização de inputs

### 7. Próximos Passos

1. **Implementar Login**: Integrar formulário de login
2. **Dashboard**: Criar página de dashboard pós-cadastro
3. **Atualização de Perfil**: Permitir edição de dados
4. **Logout**: Implementar funcionalidade de logout
5. **Proteção de Rotas**: Implementar guards de autenticação

### 8. Testando a Integração

1. Certifique-se de que o backend está rodando na porta 3000
2. Configure a variável `NEXT_PUBLIC_API_URL` no `.env.local`
3. Execute o frontend: `npm run dev`
4. Acesse `/register` e teste o cadastro
5. Verifique se os dados são salvos no backend

### 9. Troubleshooting

#### Erro de CORS
- Verifique se o backend está configurado para aceitar requisições do frontend
- Confirme se a URL da API está correta

#### Erro de Conexão
- Verifique se o backend está rodando
- Confirme se a porta está correta (3000)

#### Erro de Validação
- Verifique se os dados estão no formato correto
- Confirme se todos os campos obrigatórios estão preenchidos

## 📝 Notas Importantes

- A data de nascimento é definida como placeholder (`1990-01-01`) e deve ser atualizada na próxima etapa
- O CPF é formatado automaticamente no frontend e enviado apenas com números para o backend
- O CREF é formatado no frontend e enviado no formato correto para o backend
- O token JWT é armazenado no localStorage para persistência entre sessões
