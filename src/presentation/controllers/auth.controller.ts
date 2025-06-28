import { Controller, Post, Body, UnauthorizedException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../application/dto/auth/login.dto';
import { TokenResponseDto } from '../../application/dto/auth/token-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RefreshTokenDto } from 'src/application/dto/auth/refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Login successful',
        type: TokenResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.authService.generateToken(user);
    }

    @Post('refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Token refreshed successfully',
        type: TokenResponseDto,
    })
    async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
        return this.authService.refreshAccessToken(refreshTokenDto);
    }
}
