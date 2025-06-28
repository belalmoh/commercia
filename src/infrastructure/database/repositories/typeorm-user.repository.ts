import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntityRepository: Repository<UserEntity>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        const userEntity = await this.userEntityRepository.findOne({ where: { email } });
        return userEntity ? this.toDomain(userEntity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const userEntity = await this.userEntityRepository.findOne({ where: { id } });
        return userEntity ? this.toDomain(userEntity) : null;
    }

    async save(user: User): Promise<User> {
        const userEntity = this.toEntity(user);
        const savedUser = await this.userEntityRepository.save(userEntity);
        return this.toDomain(savedUser);
    }

    async delete(id: string): Promise<void> {
        await this.userEntityRepository.delete(id);
    }

    async findAll(limit?: number, offset?: number): Promise<User[]> {
        const userEntities = await this.userEntityRepository.find({ skip: offset, take: limit });
        return userEntities.map((userEntity) => this.toDomain(userEntity));
    }

    async existsByEmail(email: string): Promise<boolean> {
        const count = await this.userEntityRepository.count({ where: { email } });
        return count > 0;
    }

    private toDomain(userEntity: UserEntity): User {
        return new User(
            userEntity.id,
            userEntity.email,
            userEntity.firstName,
            userEntity.lastName,
            userEntity.role,
            userEntity.passwordHash,
            userEntity.isActive,
            userEntity.createdAt,
            userEntity.updatedAt,
        );
    }

    private toEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.id = user.id;
        userEntity.email = user.email;
        userEntity.firstName = user.firstName;
        userEntity.lastName = user.lastName;
        userEntity.role = user.role;
        userEntity.passwordHash = user.getPasswordHash();
        userEntity.isActive = user.isActive;
        userEntity.createdAt = user.createdAt;
        userEntity.updatedAt = user.updatedAt;
        return userEntity;
    }
}
