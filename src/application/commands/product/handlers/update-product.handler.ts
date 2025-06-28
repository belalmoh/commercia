import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductCommand } from '../update-product.command';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { ProductUpdatedEvent } from '../../../../application/events/product/product-updated.event';
import { Product } from '../../../../domain/entities/product.entity';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(
        @Inject('ProductRepository')
        private readonly productRepository: ProductRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: UpdateProductCommand): Promise<void> {
        const product = await this.productRepository.findById(command.id);
        if (!product) {
            throw new NotFoundException(`Product with id ${command.id} not found`);
        }

        const updatedProduct = new Product(
            product.id,
            command.name ?? product.name,
            command.description ?? product.description,
            command.price ?? product.price,
            product.category,
            product.sellerId,
            command.inventory ?? product.inventory,
            product.isActive,
            product.createdAt,
            new Date(), // Updated timestamp
        );

        await this.productRepository.save(updatedProduct);
        this.eventBus.publish(
            new ProductUpdatedEvent(command.id, {
                name: command.name,
                description: command.description,
                price: command.price,
                inventory: command.inventory,
            }),
        );
    }
}
