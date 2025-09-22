export interface RegisterUserRequest {
  fullName: string;
  username: string;
  birthDate: string;
  email: string;
  password: string;
  gender: string;
  cpf: string;
}

export interface RegisterTrainerRequest {
  fullName: string;
  username: string;
  birthDate: string;
  email: string;
  password: string;
  gender: string;
  cpf: string;
  cref: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: 'USER' | 'TRAINER';
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
