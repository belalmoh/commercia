import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/domain/repositories/user.repository';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(
        @Inject('UserRepository') userRepository: UserRepository,
        createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const passwordHash = await bcrypt.hash(createUserDto.password, 12);
        const user = new User(
            uuidv4(),
            createUserDto.email,
            createUserDto.firstName,
            createUserDto.lastName,
            createUserDto.role,
            passwordHash,
        );
        const savedUser = await this.userRepository.save(user);
        return UserMapper.toResponseDto(savedUser);
    }

    async getUserById(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return UserMapper.toResponseDto(user);
    }

    async getAllUsers(limit: number = 10, offset: number = 0): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findAll(limit, offset);
        return users.map((user) => UserMapper.toResponseDto(user));
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }
}
