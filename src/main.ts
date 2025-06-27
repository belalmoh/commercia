import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error for unknown properties
            transform: true, // Transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: true, // Convert string to number automatically
            },
        }),
    );

    // Enable CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Digital Marketplace API')
        .setDescription('A comprehensive e-commerce marketplace API built with Clean Architecture')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true, // Keeps auth token between page refreshes
        },
    });

    const port = configService.get('PORT', 3000);
    await app.listen(port);

    console.log(`🚀 Marketplace API is running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api`);
    console.log(`🗄️ Database: ${configService.get('DATABASE_NAME')} on ${configService.get('DATABASE_HOST')}`);
}

bootstrap();
