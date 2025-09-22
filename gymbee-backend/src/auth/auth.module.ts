import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt.service';
import { GoogleOAuthService } from './google-oauth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AchievementsService } from '../achievements/achievements.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtAuthService, GoogleOAuthService, JwtStrategy, AchievementsService],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthService],
})
export class AuthModule { }
