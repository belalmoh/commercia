import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class UserResponseDto {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ example: 'John' })
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    lastName: string;

    @ApiProperty({ example: 'John Doe' })
    fullName: string;

    @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
    role: UserRole;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: '2021-01-01' })
    createdAt: Date;
}
