import { Injectable, Logger, BadRequestException, InternalServerErrorException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserViewDto } from './view/UserViewDTO';
import { JwtAuthService } from './jwt.service';
import { GoogleOAuthService } from './google-oauth.service';
import { LoginDto, GoogleLoginDto, AuthResponseDto } from './dto/LoginDTO';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtAuthService: JwtAuthService,
        private googleOAuthService: GoogleOAuthService,
    ) { }

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
    }): Promise<AuthResponseDto> {
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

            const accessToken = this.jwtAuthService.generateToken(user);
            const expiresIn = this.jwtAuthService.getTokenExpirationTime();

            this.logger.log(`Usuário criado com sucesso: ${user.username}`);
            
            return {
                accessToken,
                tokenType: 'Bearer',
                expiresIn,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            };
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
    }): Promise<AuthResponseDto> {
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

            const accessToken = this.jwtAuthService.generateToken(user);
            const expiresIn = this.jwtAuthService.getTokenExpirationTime();

            this.logger.log(`Personal trainer criado com sucesso: ${user.username}`);
            
            return {
                accessToken,
                tokenType: 'Bearer',
                expiresIn,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            };
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

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
                include: { trainer: true },
            });

            if (!user) {
                throw new UnauthorizedException('Email ou senha incorretos');
            }

            const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Email ou senha incorretos');
            }

            const accessToken = this.jwtAuthService.generateToken(user);
            const expiresIn = this.jwtAuthService.getTokenExpirationTime();

            this.logger.log(`Login realizado com sucesso: ${user.username}`);

            return {
                accessToken,
                tokenType: 'Bearer',
                expiresIn,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(
                `Erro ao fazer login: ${loginDto.email} - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao fazer login, tente novamente mais tarde');
        }
    }

    async googleLogin(googleLoginDto: GoogleLoginDto): Promise<AuthResponseDto> {
        try {
            const googleUser = await this.googleOAuthService.verifyGoogleToken(googleLoginDto.accessToken);

            let user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
                include: { trainer: true },
            });

            // Se o usuário não existe, criar um novo
            if (!user) {
                const passwordHash = await bcrypt.hash(googleUser.sub, 10);
                
                user = await this.prisma.user.create({
                    data: {
                        fullName: googleUser.name,
                        username: googleUser.email.split('@')[0] + '_' + Date.now(),
                        email: googleUser.email,
                        passwordHash,
                        role: 'USER',
                        gender: 'Outro',
                        birthDate: new Date('1990-01-01'), // Data padrão
                        cpf: '00000000000', // CPF padrão para usuários Google
                    },
                    include: { trainer: true },
                });

                this.logger.log(`Usuário Google criado: ${user.username}`);
            }

            const accessToken = this.jwtAuthService.generateToken(user);
            const expiresIn = this.jwtAuthService.getTokenExpirationTime();

            this.logger.log(`Login Google realizado com sucesso: ${user.username}`);

            return {
                accessToken,
                tokenType: 'Bearer',
                expiresIn,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(
                `Erro no login Google: ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro no login Google, tente novamente mais tarde');
        }
    }

    async getCurrentUser(userId: string): Promise<UserViewDto> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { trainer: true },
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            return {
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
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Erro ao buscar usuário atual: ${userId} - ${this.getErrorMessage(error)}`,
                this.getErrorStack(error)
            );
            throw new InternalServerErrorException('Erro ao buscar usuário atual, tente novamente mais tarde');
        }
    }
}