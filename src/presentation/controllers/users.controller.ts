import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dto/user/create-user.dto';
import { UserResponseDto } from '../../application/dto/user/user-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Public() // Registration should be public!
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully created',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User with email already exists',
    })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(createUserDto);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Current user profile',
        type: UserResponseDto,
    })
    async getCurrentUser(@CurrentUser() user: any): Promise<UserResponseDto> {
        return this.userService.getUserById(user.id);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User found',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users with pagination' })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'offset', required: false, example: 0 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of users',
        type: [UserResponseDto],
    })
    async getAllUsers(@Query('limit') limit = 10, @Query('offset') offset = 0): Promise<UserResponseDto[]> {
        return this.userService.getAllUsers(Number(limit), Number(offset));
    }
}
