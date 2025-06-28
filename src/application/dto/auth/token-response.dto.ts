import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../user/user-response.dto';

export class TokenResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    tokenType: string;

    @ApiProperty()
    expiresIn: number;

    @ApiProperty()
    refreshExpiresIn: number;

    @ApiProperty()
    user: UserResponseDto;
}
