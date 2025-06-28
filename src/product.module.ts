import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { ProductsController } from './presentation/controllers/products.controller';

// Domain Entities
import { ProductEntity } from './infrastructure/database/entities/product.entity';
import { ProductReadModelEntity } from './infrastructure/database/entities/product-read-model.entity';

// Repositories
import { TypeOrmProductRepository } from './infrastructure/database/repositories/typeorm-product.repository';
import { TypeOrmProductQueryRepository } from './infrastructure/database/repositories/typeorm-product-query.repository';

// Search Service
import { ElasticsearchProductSearchService } from './infrastructure/search/elasticsearch-product-search.service';

// Command Handlers
import { UpdateProductHandler } from './application/commands/product/handlers/update-product.handler';
import { CreateProductHandler } from './application/commands/product/handlers/create-product.handler';
import { ReserveInventoryHandler } from './application/commands/product/handlers/reserve-inventory.handler';

// Query Handlers
import { GetProductDetailsHandler } from './application/queries/product/handlers/get-product-details.handler';
import { SearchProductsHandler } from './application/queries/product/handlers/search-products.handler';
import { GetProductsHandler } from './application/queries/product/handlers/get-products.handler';

// Event Handlers
import { ProductCreatedHandler } from './application/events/product/handlers/product-created.handler';
import { InventoryReservedHandler } from './application/events/product/handlers/inventory-reserved.handler';
import { ProductUpdatedHandler } from './application/events/product/handlers/product-updated.handler';

import { UserModule } from './user.module';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, ReserveInventoryHandler];

const QueryHandlers = [GetProductsHandler, SearchProductsHandler, GetProductDetailsHandler];

const EventHandlers = [ProductCreatedHandler, InventoryReservedHandler, ProductUpdatedHandler];

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ProductReadModelEntity]), CqrsModule, UserModule],
    controllers: [ProductsController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHandlers,
        { provide: 'ProductRepository', useClass: TypeOrmProductRepository },
        { provide: 'ProductQueryRepository', useClass: TypeOrmProductQueryRepository },
        { provide: 'ProductSearchService', useClass: ElasticsearchProductSearchService },
    ],
    exports: ['ProductRepository', 'ProductQueryRepository'],
})
export class ProductModule {}
