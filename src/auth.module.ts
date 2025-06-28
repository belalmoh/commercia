import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

// Services
import { AuthService } from './application/services/auth.service';

import { UserModule } from './user.module';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';

@Module({
    imports: [UserModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
