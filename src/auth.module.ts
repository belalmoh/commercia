import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

// Services
import { AuthService } from './application/services/auth.service';

import { UserModule } from './user.module';

@Module({
    imports: [UserModule, JwtModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
