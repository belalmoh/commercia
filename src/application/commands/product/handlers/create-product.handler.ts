import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { Product } from 'src/domain/entities/product.entity';
import { ProductCreatedEvent } from 'src/domain/events/product-created.event';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
    constructor(
        @Inject('ProductRepository') private readonly productRepository: ProductRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: CreateProductCommand): Promise<string> {
        const { name, description, price, category, sellerId, inventory } = command;

        const product = new Product(uuidv4(), name, description, price, category, sellerId, inventory);

        await this.productRepository.save(product);

        this.eventBus.publish(new ProductCreatedEvent(product));

        return product.id;
    }
}
