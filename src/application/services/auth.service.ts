import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { TokenResponseDto } from '../dto/auth/token-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('UserRepository') private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.getPasswordHash());
        return isPasswordValid ? user : null;
    }

    async generateToken(user: User): Promise<TokenResponseDto> {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // Generate access token (short-lived)
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        });

        // Generate refresh token (long-lived, same payload)
        const refreshToken = this.jwtService.sign(
            { ...payload, type: 'refresh' },
            { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') },
        );

        return {
            accessToken,
            refreshToken, // ← Add this
            tokenType: 'Bearer',
            expiresIn: 15 * 60, // 15 minutes
            refreshExpiresIn: 7 * 24 * 60 * 60, // 7 days
            user: UserMapper.toResponseDto(user),
        };
    }

    async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
        try {
            const decoded = this.jwtService.verify(refreshTokenDto.refreshToken);

            const user = await this.userRepository.findById(decoded.sub);
            if (!user || !user.isActive) {
                throw new UnauthorizedException('User not found or inactive');
            }

            return this.generateToken(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
