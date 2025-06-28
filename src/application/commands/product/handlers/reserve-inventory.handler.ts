import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ReserveInventoryCommand } from '../reserve-inventory.command';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { Product } from 'src/domain/entities/product.entity';
import { ProductInventoryReservedEvent } from 'src/domain/events/product-inventory-reserved.event';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(ReserveInventoryCommand)
export class ReserveInventoryHandler implements ICommandHandler<ReserveInventoryCommand> {
    constructor(
        @Inject('ProductRepository') private readonly productRepository: ProductRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: ReserveInventoryCommand): Promise<void> {
        const { productId, quantity, userId } = command;

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const reservedProduct = product.reserveInventory(quantity);

        await this.productRepository.save(reservedProduct);

        this.eventBus.publish(new ProductInventoryReservedEvent(reservedProduct));
    }
}
