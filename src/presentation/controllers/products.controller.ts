import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// Commands
import { CreateProductCommand } from '../../application/commands/product/create-product.command';
import { ReserveInventoryCommand } from '../../application/commands/product/reserve-inventory.command';
import { UpdateProductCommand } from '../../application/commands/product/update-product.command';

// Queries
import { GetProductsQuery } from '../../application/queries/product/get-products.query';
import { SearchProductsQuery } from '../../application/queries/product/search-products.query';
import { GetProductDetailsQuery } from '../../application/queries/product/get-product-details.query';

// DTOs
import { CreateProductDto } from '../../application/dto/product/create-product.dto';
import { UpdateProductDto } from '../../application/dto/product/update-product.dto';
import { ReserveInventoryDto } from '../../application/dto/product/reserve-inventory.dto';
import { ProductResponseDto } from '../../application/dto/product/product-response.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    // ========== COMMANDS (Write Operations) ==========

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product created successfully',
        schema: { properties: { id: { type: 'string' } } },
    })
    async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any): Promise<{ id: string }> {
        const command = new CreateProductCommand(
            createProductDto.name,
            createProductDto.description,
            createProductDto.price,
            createProductDto.category,
            user.id, // sellerId from current user
            createProductDto.inventory,
        );

        const productId = await this.commandBus.execute(command);
        return { id: productId };
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product' })
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<{ success: boolean }> {
        const command = new UpdateProductCommand(
            id,
            updateProductDto.name,
            updateProductDto.description,
            updateProductDto.price,
            updateProductDto.inventory,
        );

        await this.commandBus.execute(command);
        return { success: true };
    }

    @Post(':id/reserve')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reserve product inventory' })
    async reserveInventory(
        @Param('id') id: string,
        @Body() reserveDto: ReserveInventoryDto,
        @CurrentUser() user: any,
    ): Promise<{ success: boolean }> {
        const command = new ReserveInventoryCommand(id, reserveDto.quantity, user.id);

        await this.commandBus.execute(command);
        return { success: true };
    }

    // ========== QUERIES (Read Operations) ==========

    @Get()
    @ApiOperation({ summary: 'Get products with filters' })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'sellerId', required: false })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'offset', required: false, example: 0 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of products',
        type: [ProductResponseDto],
    })
    async getProducts(
        @Query('category') category?: string,
        @Query('sellerId') sellerId?: string,
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
    ): Promise<ProductResponseDto[]> {
        const query = new GetProductsQuery(category, sellerId, Number(limit), Number(offset));

        return this.queryBus.execute(query);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search products' })
    @ApiQuery({ name: 'q', description: 'Search term' })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'maxPrice', required: false })
    async searchProducts(
        @Query('q') searchTerm: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
    ): Promise<ProductResponseDto[]> {
        const query = new SearchProductsQuery(
            searchTerm,
            category,
            minPrice ? Number(minPrice) : undefined,
            maxPrice ? Number(maxPrice) : undefined,
            Number(limit),
            Number(offset),
        );

        return this.queryBus.execute(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product details' })
    async getProductDetails(@Param('id') id: string, @CurrentUser() user?: any): Promise<ProductResponseDto> {
        const query = new GetProductDetailsQuery(id, user?.id);
        return this.queryBus.execute(query);
    }
}
