import { IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveInventoryDto {
    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsPositive()
    @Max(100) // Business rule: max 100 units per reservation
    quantity: number;
}
