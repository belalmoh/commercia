import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/user/user-response.dto';

export class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.getFullName(),
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
}
