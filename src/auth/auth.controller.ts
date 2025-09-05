import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterTrainerDto, RegisterUserDto } from './dto/RegisterUserDTO';
import { UserViewDto } from './view/UserViewDTO';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register-user')
    @ApiOperation({ summary: 'Cadastro de membro', description: 'Registra um novo membro no sistema' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Membro cadastrado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos (ex: CPF inválido)' })
    @ApiResponse({ status: 409, description: 'Username, email ou CPF já cadastrados' })
    async registerUser(@Body() body: RegisterUserDto) {
        return this.authService.registerUser(body);
    }

    @Post('register-trainer')
    @ApiOperation({ summary: 'Cadastro de personal trainer', description: 'Registra um novo personal trainer no sistema' })
    @ApiBody({ type: RegisterTrainerDto })
    @ApiResponse({ status: 201, description: 'Personal trainer cadastrado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos (ex: CPF inválido)' })
    @ApiResponse({ status: 409, description: 'Username, email ou CREF já cadastrados' })
    async registerTrainer(@Body() body: RegisterTrainerDto) {
        return this.authService.registerTrainer(body);
    }

    @Get('users')
    @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna todos os usuários cadastrados' })
    @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserViewDto] })
    @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' })
    async getUsers(): Promise<UserViewDto[]> {
        return this.authService.getUsers();
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserViewDto })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async getUserById(@Param('id') id: string): Promise<UserViewDto> {
        return this.authService.getUserById(id);
    }
}
