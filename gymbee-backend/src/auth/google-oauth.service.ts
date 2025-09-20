import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuthService {
    private readonly logger = new Logger(GoogleOAuthService.name);
    private readonly client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client();
    }

    async verifyGoogleToken(accessToken: string): Promise<{
        email: string;
        name: string;
        picture?: string;
        sub: string;
    }> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: accessToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            
            if (!payload) {
                throw new UnauthorizedException('Token do Google inválido');
            }

            return {
                email: payload.email!,
                name: payload.name!,
                picture: payload.picture,
                sub: payload.sub,
            };
        } catch (error) {
            this.logger.error(`Erro ao verificar token do Google: ${error.message}`);
            throw new UnauthorizedException('Token do Google inválido ou expirado');
        }
    }
}



