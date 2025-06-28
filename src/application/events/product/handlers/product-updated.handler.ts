import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProductUpdatedEvent } from '../product-updated.event';
import { ProductQueryRepository } from '../../../read-models/repositories/product-query.repository';
import { ProductSearchService } from '../../../read-models/services/product-search.service';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler implements IEventHandler<ProductUpdatedEvent> {
    constructor(
        @Inject('ProductQueryRepository')
        private readonly productQueryRepository: ProductQueryRepository,
        @Inject('ProductSearchService')
        private readonly productSearchService: ProductSearchService,
    ) {}

    async handle(event: ProductUpdatedEvent) {
        console.log(`📝 Product updated: ${event.id}`);

        // Prepare update data - only include fields that changed
        const updateData: any = {
            id: event.id,
            updatedAt: event.updatedAt,
        };

        // Add only the fields that were actually changed
        if (event.changes.name !== undefined) {
            updateData.name = event.changes.name;
            // Regenerate tags if name changed
            updateData.tags = this.generateTags(event.changes.name, '');
        }

        if (event.changes.description !== undefined) {
            updateData.description = event.changes.description;
            // Regenerate tags if description changed (would need to fetch current name)
        }

        if (event.changes.price !== undefined) {
            updateData.price = event.changes.price;
        }

        if (event.changes.inventory !== undefined) {
            updateData.inventory = event.changes.inventory;
        }

        // Update read model in database
        await this.productQueryRepository.updateFromEvent(updateData);

        // If name or description changed, we need to update search index
        if (event.changes.name !== undefined || event.changes.description !== undefined) {
            // Get the full updated product from read model
            const updatedProduct = await this.productQueryRepository.findById(event.id);
            if (updatedProduct) {
                // Re-index in search engine
                await this.productSearchService.indexProduct(updatedProduct);
            }
        }

        // Could also trigger other events:
        // - If price changed significantly, notify followers
        // - If inventory changed, update related orders
        // - If name changed, update analytics

        if (event.changes.price !== undefined) {
            console.log(`💰 Price updated for product ${event.id}: ${event.changes.price}`);
        }

        if (event.changes.inventory !== undefined) {
            console.log(`📦 Inventory updated for product ${event.id}: ${event.changes.inventory} units`);

            // Alert if inventory is getting low
            if (event.changes.inventory < 10) {
                console.log(`⚠️ Low inventory alert for product ${event.id}`);
                // Could publish LowInventoryEvent here
            }
        }
    }

    private generateTags(name: string, description: string): string[] {
        const text = `${name} ${description}`.toLowerCase();
        const words = text.split(/[\s,.-]+/);

        return words
            .filter((word) => word.length > 2)
            .filter((word) => !this.isStopWord(word))
            .filter((word, index, array) => array.indexOf(word) === index)
            .slice(0, 15);
    }

    private isStopWord(word: string): boolean {
        const stopWords = ['the', 'and', 'or', 'but', 'with', 'for', 'from', 'to', 'of', 'in', 'on', 'at'];
        return stopWords.includes(word);
    }
}
