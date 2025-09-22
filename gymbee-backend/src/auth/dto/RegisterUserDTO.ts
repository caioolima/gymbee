/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: 'Nome completo do membro',
        example: 'João da Silva',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        description: 'Nome de usuário único',
        example: 'joaosilva',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Data de nascimento no formato YYYY-MM-DD',
        example: '1990-05-15',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })
    birthDate: string;

    @ApiProperty({
        description: 'Endereço de email válido',
        example: 'joao@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Senha do membro (mínimo 6 caracteres)',
        example: 'minhasenha123',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Gênero do membro',
        example: 'M',
        enum: ['M', 'F', 'Outro'],
    })
    @IsEnum(['M', 'F', 'Outro'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({
        description: 'CPF do membro (apenas números)',
        example: '12345678901',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
    cpf: string;

    @ApiProperty({
        description: 'Número de telefone (opcional)',
        example: '11987654321',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
    phone?: string;
}

export class RegisterTrainerDto {
    @ApiProperty({
        description: 'Nome completo do personal trainer',
        example: 'Maria Santos',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        description: 'Nome de usuário único',
        example: 'mariasantos',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Data de nascimento no formato YYYY-MM-DD',
        example: '1985-08-20',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })
    birthDate: string;

    @ApiProperty({
        description: 'Endereço de email válido',
        example: 'maria@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Senha do personal trainer',
        example: 'minhasenha123',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Gênero do personal trainer',
        example: 'F',
        enum: ['M', 'F', 'Outro'],
    })
    @IsEnum(['M', 'F', 'Outro'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({
        description: 'CPF do personal trainer (apenas números)',
        example: '12345678901',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
    cpf: string;

    @ApiProperty({
        description: 'Número do CREF (Conselho Regional de Educação Física)',
        example: '123456-G/SP',
    })
    @IsString()
    @IsNotEmpty()
    cref: string;

    @ApiProperty({
        description: 'Número de telefone (opcional)',
        example: '11987654321',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
    phone?: string;
}