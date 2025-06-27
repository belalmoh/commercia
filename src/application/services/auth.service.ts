import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { TokenResponseDto } from '../dto/auth/token-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/domain/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(
        @Inject('UserRepository') private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
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
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 86400,
            user: UserMapper.toResponseDto(user),
        };
    }
}
