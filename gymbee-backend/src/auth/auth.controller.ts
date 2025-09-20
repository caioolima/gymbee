import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterTrainerDto, RegisterUserDto } from './dto/RegisterUserDTO';
import { UserViewDto } from './view/UserViewDTO';
import { LoginDto, GoogleLoginDto, AuthResponseDto } from './dto/LoginDTO';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register-user')
    @ApiOperation({ summary: 'Cadastro de membro', description: 'Registra um novo membro no sistema' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Membro cadastrado com sucesso', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos (ex: CPF inválido)' })
    @ApiResponse({ status: 409, description: 'Username, email ou CPF já cadastrados' })
    async registerUser(@Body() body: RegisterUserDto): Promise<AuthResponseDto> {
        return this.authService.registerUser(body);
    }

    @Post('register-trainer')
    @ApiOperation({ summary: 'Cadastro de personal trainer', description: 'Registra um novo personal trainer no sistema' })
    @ApiBody({ type: RegisterTrainerDto })
    @ApiResponse({ status: 201, description: 'Personal trainer cadastrado com sucesso', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos (ex: CPF inválido)' })
    @ApiResponse({ status: 409, description: 'Username, email ou CREF já cadastrados' })
    async registerTrainer(@Body() body: RegisterTrainerDto): Promise<AuthResponseDto> {
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

    @Post('login')
    @ApiOperation({ summary: 'Login com email e senha', description: 'Autentica usuário com email e senha' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Email ou senha incorretos' })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Post('google')
    @ApiOperation({ summary: 'Login com Google OAuth', description: 'Autentica usuário com token do Google' })
    @ApiBody({ type: GoogleLoginDto })
    @ApiResponse({ status: 200, description: 'Login Google realizado com sucesso', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Token do Google inválido' })
    async googleLogin(@Body() googleLoginDto: GoogleLoginDto): Promise<AuthResponseDto> {
        return this.authService.googleLogin(googleLoginDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter dados do usuário autenticado', description: 'Retorna os dados do usuário logado' })
    @ApiResponse({ status: 200, description: 'Dados do usuário', type: UserViewDto })
    @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
    async getCurrentUser(@Request() req): Promise<UserViewDto> {
        return this.authService.getCurrentUser(req.user.id);
    }
}
