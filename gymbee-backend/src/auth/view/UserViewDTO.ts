import { ApiProperty } from '@nestjs/swagger';

export class UserViewDto {
    @ApiProperty({ description: 'ID do usuário' })
    id: string;

    @ApiProperty({ description: 'Nome completo do usuário' })
    fullName: string;

    @ApiProperty({ description: 'Nome de usuário único' })
    username: string;

    @ApiProperty({ description: 'Data de nascimento' })
    birthDate: Date;

    @ApiProperty({ description: 'Email do usuário' })
    email: string;

    @ApiProperty({ description: 'Gênero do usuário' })
    gender: string;

    @ApiProperty({ description: 'Role do usuário' })
    role: string;

    @ApiProperty({
        description: 'CPF do usuário',
        nullable: true,
        required: false
    })
    cpf: string;

    @ApiProperty({
        description: 'Dados do trainer, se for treinador',
        required: false,
        nullable: true
    })
    trainer?: {
        cref: string;
    };

    @ApiProperty({ description: 'Data de criação do usuário' })
    createdAt: Date;
}