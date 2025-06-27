import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { UsersController } from './presentation/controllers/users.controller';

// Services
import { UserService } from './application/services/user.service';

// Infrastructure
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { TypeOrmUserRepository } from './infrastructure/database/repositories/typeorm-user.repository';

// Repositories
import { UserRepository } from './domain/domain/repositories/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UsersController],
    providers: [
        UserService,
        TypeOrmUserRepository,
        {
            provide: 'UserRepository',
            useExisting: TypeOrmUserRepository,
        },
    ],
    exports: [UserService, 'UserRepository'],
})
export class UserModule {}
