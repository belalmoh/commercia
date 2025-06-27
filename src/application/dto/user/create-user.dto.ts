/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @MinLength(2)
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @MinLength(2)
    lastName: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole = UserRole.CUSTOMER;
}
