import { Injectable, Logger, BadRequestException, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserViewDto } from './view/UserViewDTO';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private prisma: PrismaService) { }

    private validateCPF(cpf: string): boolean {
        if (!cpf) return false;

        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        const calcDigit = (factor: number, max: number) => {
            let sum = 0;
            for (let i = 0; i < max; i++) sum += parseInt(cpf.charAt(i)) * factor--;
            const result = (sum * 10) % 11;
            return result === 10 ? 0 : result;
        };

        const digit1 = calcDigit(10, 9);
        const digit2 = calcDigit(11, 10);
        return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
    }


    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }

    private getErrorStack(error: unknown): string | undefined {
        if (error instanceof Error) {
            return error.stack;
        }
        return undefined;
    }

    async registerUser(data: {
        fullName: string;
        username: string;
        birthDate: string;
        email: string;
        password: string;
        gender: string;
        cpf: string;
    }): Promise<User> {
        if (!this.validateCPF(data.cpf)) {
            throw new BadRequestException('CPF inválido');
        }

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email },
                    { cpf: data.cpf },
                ],
            },
        });

        if (existingUser) {
            throw new ConflictException('Username, email ou CPF já cadastrado');
        }

        try {
            const passwordHash = await bcrypt.hash(data.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    fullName: data.fullName,
                    username: data.username,
                    birthDate: new Date(data.birthDate),
                    email: data.email,
                    gender: data.gender,
                    passwordHash,
                    role: 'USER',
                    cpf: data.cpf,
                },
            });

            this.logger.log(`Usuário criado com sucesso: ${user.username}`);
            return user;
        } catch (error) {
            this.logger.error(
                `Erro ao criar usuário: ${data.username} - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao criar usuário, tente novamente mais tarde');
        }
    }

    async registerTrainer(data: {
        fullName: string;
        username: string;
        birthDate: string;
        email: string;
        password: string;
        gender: string;
        cpf: string;
        cref: string;
    }): Promise<User> {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email },
                ],
            },
        });

        const existingCref = await this.prisma.trainer.findUnique({
            where: { cref: data.cref },
        });

        if (existingUser || existingCref) {
            throw new ConflictException('Username, email ou CREF já cadastrado');
        }

        try {
            const passwordHash = await bcrypt.hash(data.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    fullName: data.fullName,
                    username: data.username,
                    birthDate: new Date(data.birthDate),
                    email: data.email,
                    gender: data.gender,
                    passwordHash,
                    role: 'TRAINER',
                    cpf: data.cpf,
                },
            });

            await this.prisma.trainer.create({
                data: {
                    cref: data.cref,
                    userId: user.id,
                },
            });

            this.logger.log(`Personal trainer criado com sucesso: ${user.username}`);
            return user;
        } catch (error) {
            this.logger.error(
                `Erro ao criar personal trainer: ${data.username} - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao criar personal trainer, tente novamente mais tarde');
        }
    }

    async getUsers(): Promise<UserViewDto[]> {
        try {
            const users = await this.prisma.user.findMany({ include: { trainer: true } });

            if (!users.length) throw new NotFoundException('Nenhum usuário encontrado');

            return users.map(user => ({
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                birthDate: user.birthDate,
                email: user.email,
                gender: user.gender,
                role: user.role,
                cpf: user.cpf,
                trainer: user.trainer ? { cref: user.trainer.cref } : undefined,
                createdAt: user.createdAt,
            }));
        } catch (error) {
            this.logger.error(
                `Erro ao buscar usuários - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao buscar usuários, tente novamente mais tarde');
        }
    }

    async getUserById(id: string): Promise<UserViewDto> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                include: { trainer: true },
            });

            if (!user) throw new NotFoundException('Usuário não encontrado');

            const mappedUser: UserViewDto = {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                birthDate: user.birthDate,
                email: user.email,
                gender: user.gender,
                role: user.role,
                cpf: user.cpf,
                trainer: user.trainer ? { cref: user.trainer.cref } : undefined,
                createdAt: user.createdAt,
            };
            return mappedUser;
        } catch (error) {
            this.logger.error(
                `Erro ao buscar usuário: ${id} - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao buscar usuário, tente novamente mais tarde');
        }
    }
}