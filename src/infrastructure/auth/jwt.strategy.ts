// src/infrastructure/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        // This runs for every authenticated request
        const user = await this.userRepository.findById(payload.sub);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
        }; // This becomes req.user
    }
}
