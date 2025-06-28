import { User } from '../entities/user.entity';

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    existsByEmail(email: string): Promise<boolean>;
}
