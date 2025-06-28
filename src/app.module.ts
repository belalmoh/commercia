import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

// Feature modules
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ProductModule } from './product.module';

import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

import { UserEntity } from './infrastructure/database/entities/user.entity';
import { ProductEntity } from './infrastructure/database/entities/product.entity';
import { ProductReadModelEntity } from './infrastructure/database/entities/product-read-model.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [UserEntity, ProductEntity, ProductReadModelEntity], // Add all entities here
                synchronize: configService.get('NODE_ENV') === 'development', // Only in dev!
                // logging: configService.get('NODE_ENV') === 'development',
            }),
        }),
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                node: configService.get('ELASTICSEARCH_NODE', 'http://localhost:9200'),
            }),
        }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '24h') },
            }),
        }),
        PassportModule,
        UserModule,
        AuthModule,
        ProductModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        JwtStrategy,
    ],
})
export class AppModule {}
