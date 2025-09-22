import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    role: string;
}

@Injectable()
export class JwtAuthService {
    constructor(private jwtService: NestJwtService) {}

    generateToken(user: User): string {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }

    verifyToken(token: string): JwtPayload {
        return this.jwtService.verify(token);
    }

    getTokenExpirationTime(): number {
        // 24 horas em segundos
        return 86400;
    }
}



