import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InventoryReservedEvent } from '../inventory-reserved.event';
import { ProductQueryRepository } from '../../../read-models/repositories/product-query.repository';

@EventsHandler(InventoryReservedEvent)
export class InventoryReservedHandler implements IEventHandler<InventoryReservedEvent> {
    constructor(
        @Inject('ProductQueryRepository')
        private readonly productQueryRepository: ProductQueryRepository,
    ) {}

    async handle(event: InventoryReservedEvent): Promise<void> {
        console.log(`📦 Inventory reserved: ${event.quantity} units of product ${event.productId}`);

        const { productId, quantity, userId, remainingInventory } = event;

        await this.productQueryRepository.updateFromEvent({
            id: event.productId,
            inventory: event.remainingInventory,
            updatedAt: event.reservedAt,
        });

        if (remainingInventory < 10) {
            console.log(`🔔 Low inventory: ${remainingInventory} units of product ${productId}`);
        }
    }
}
