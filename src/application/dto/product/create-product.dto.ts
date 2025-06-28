import { IsString, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 14 Pro' })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'Latest iPhone with advanced camera system' })
    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    description: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({ example: 'electronics' })
    @IsString()
    category: string;

    @ApiProperty({ example: 50 })
    @IsNumber()
    @IsPositive()
    inventory: number;
}
