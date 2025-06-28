import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProductCreatedEvent } from '../product-created.event';
import { ProductQueryRepository } from '../../../read-models/repositories/product-query.repository';
import { ProductSearchService } from '../../../read-models/services/product-search.service';
import { ProductReadModel } from '../../../read-models/product.read-model';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { getCategoryName, generateTags } from '../../../../common/helpers';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
    constructor(
        @Inject('ProductQueryRepository')
        private readonly productQueryRepository: ProductQueryRepository,
        @Inject('ProductSearchService')
        private readonly productSearchService: ProductSearchService,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {}

    async handle(event: ProductCreatedEvent): Promise<void> {
        console.log(`📦 Product created: ${event.name}`);

        const seller = await this.userRepository.findById(event.sellerId);

        const readModel = new ProductReadModel(
            event.id,
            event.name,
            event.description,
            event.price,
            event.category,
            getCategoryName(event.category), // Helper method
            event.sellerId,
            seller ? seller.getFullName() : 'Unknown Seller',
            event.inventory,
            true, // isActive
            0, // averageRating (initial)
            0, // reviewCount (initial)
            generateTags(event.name, event.description), // Search tags
            event.createdAt,
            event.createdAt,
        );
    }
}
