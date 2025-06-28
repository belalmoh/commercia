import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    category: string;

    @ApiProperty()
    categoryName: string;

    @ApiProperty()
    sellerId: string;

    @ApiProperty()
    sellerName: string;

    @ApiProperty()
    inventory: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    averageRating: number;

    @ApiProperty()
    reviewCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
