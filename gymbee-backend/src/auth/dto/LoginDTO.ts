import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Endereço de email válido',
        example: 'joao@email.com',
    })
    @IsEmail({}, { message: 'Email deve ter um formato válido' })
    email: string;

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'minhasenha123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
    password: string;
}

export class GoogleLoginDto {
    @ApiProperty({
        description: 'Token de acesso do Google OAuth',
        example: 'ya29.a0AfH6SMC...',
    })
    @IsString()
    accessToken: string;
}

export class AuthResponseDto {
    @ApiProperty({
        description: 'Token JWT para autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Tipo do token',
        example: 'Bearer',
    })
    tokenType: string;

    @ApiProperty({
        description: 'Tempo de expiração em segundos',
        example: 3600,
    })
    expiresIn: number;

    @ApiProperty({
        description: 'Dados do usuário autenticado',
    })
    user: {
        id: string;
        fullName: string;
        username: string;
        email: string;
        role: string;
    };
}



