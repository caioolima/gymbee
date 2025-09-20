/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        description: 'Nome completo do membro',
        example: 'João da Silva',
    })
    fullName: string;

    @ApiProperty({
        description: 'Nome de usuário único',
        example: 'joaosilva',
    })
    username: string;

    @ApiProperty({
        description: 'Data de nascimento no formato YYYY-MM-DD',
        example: '1990-05-15',
    })
    birthDate: string;

    @ApiProperty({
        description: 'Endereço de email válido',
        example: 'joao@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'Senha do membro (mínimo 6 caracteres)',
        example: 'minhasenha123',
        minLength: 6,
    })
    password: string;

    @ApiProperty({
        description: 'Gênero do membro',
        example: 'M',
        enum: ['M', 'F', 'Outro'],
    })
    gender: string;

    @ApiProperty({
        description: 'CPF do membro (apenas números)',
        example: '12345678901',
    })
    cpf: string;
}

export class RegisterTrainerDto {
    @ApiProperty({
        description: 'Nome completo do personal trainer',
        example: 'Maria Santos',
    })
    fullName: string;

    @ApiProperty({
        description: 'Nome de usuário único',
        example: 'mariasantos',
    })
    username: string;

    @ApiProperty({
        description: 'Data de nascimento no formato YYYY-MM-DD',
        example: '1985-08-20',
    })
    birthDate: string;

    @ApiProperty({
        description: 'Endereço de email válido',
        example: 'maria@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'Senha do personal trainer',
        example: 'minhasenha123',
    })
    password: string;

    @ApiProperty({
        description: 'Gênero do personal trainer',
        example: 'F',
        enum: ['M', 'F', 'Outro'],
    })
    gender: string;

    cpf: string;
    @ApiProperty({
        description: 'Número do CREF (Conselho Regional de Educação Física)',
        example: '123456-G/SP',
    })
    cref: string;
}