import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const clerkPublishableKey = configService.get<string>('CLERK_PUBLISHABLE_KEY');
        console.log('🔑 Clerk Publishable Key:', clerkPublishableKey);

        // Extract the domain from the publishable key (e.g., pk_test_YW1hemVkLWRhc3NpZS01NC5jbGVyay5hY2NvdW50cy5kZXYk)
        // The domain is base64 encoded after "pk_test_" or "pk_live_"
        let clerkDomain = '';
        if (clerkPublishableKey) {
            const keyPart = clerkPublishableKey.replace(/^pk_(test|live)_/, '');
            try {
                clerkDomain = Buffer.from(keyPart, 'base64').toString('utf-8');
                // Remove trailing $ if present (Clerk adds this to the encoded key)
                clerkDomain = clerkDomain.replace(/\$$/, '');
                console.log('🌐 Decoded Clerk Domain:', clerkDomain);
            } catch (e) {
                console.error('Failed to decode Clerk publishable key');
            }
        }

        const jwksUri = `https://${clerkDomain}/.well-known/jwks.json`;
        console.log('🔐 JWKS URI:', jwksUri);

        const client = jwksClient.default({
            jwksUri,
            cache: true,
            rateLimit: true,
        });

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                try {
                    console.log('🔍 Validating JWT token...');
                    const decoded = JSON.parse(
                        Buffer.from(rawJwtToken.split('.')[0], 'base64').toString(),
                    );
                    console.log('📋 JWT Header:', decoded);

                    client.getSigningKey(decoded.kid, (err, key) => {
                        if (err) {
                            console.error('❌ Error getting signing key:', err);
                            return done(err);
                        }
                        const signingKey = key.getPublicKey();
                        console.log('✅ Signing key retrieved successfully');
                        done(null, signingKey);
                    });
                } catch (error) {
                    console.error('❌ Error in secretOrKeyProvider:', error);
                    done(error);
                }
            },
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        console.log('🔐 Validating JWT payload:', JSON.stringify(payload, null, 2));

        // Clerk payload usually has 'sub' as the user ID
        if (!payload.sub) {
            console.error('❌ No sub in payload!');
            throw new UnauthorizedException();
        }

        console.log('✅ Payload validated, userId:', payload.sub);
        // Here we could sync the user with our DB if they don't exist
        // For now, we just return the payload
        return { userId: payload.sub, email: payload.email };
    }
}
