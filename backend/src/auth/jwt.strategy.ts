import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // In a real Clerk setup, you'd use jwks-rsa or the PEM public key
            // For this MVP, we'll assume a shared secret or PEM is provided in env
            secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
        });
    }

    async validate(payload: any) {
        // Clerk payload usually has 'sub' as the user ID
        if (!payload.sub) {
            throw new UnauthorizedException();
        }

        // Here we could sync the user with our DB if they don't exist
        // For now, we just return the payload
        return { userId: payload.sub, email: payload.email };
    }
}
