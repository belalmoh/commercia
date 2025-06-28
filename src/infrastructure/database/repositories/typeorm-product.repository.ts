import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';
import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productEntityRepository: Repository<ProductEntity>,
    ) {}

    async findById(id: string): Promise<Product | null> {
        const entity = await this.productEntityRepository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async findByCategory(category: string): Promise<Product[]> {
        const entities = await this.productEntityRepository.find({ where: { category } });
        return entities.map((entity) => this.toDomain(entity));
    }

    async findBySellerId(sellerId: string): Promise<Product[]> {
        const entities = await this.productEntityRepository.find({ where: { sellerId } });
        return entities.map((entity) => this.toDomain(entity));
    }

    async save(product: Product): Promise<Product> {
        const entity = this.toEntity(product);
        const savedEntity = await this.productEntityRepository.save(entity);
        return this.toDomain(savedEntity);
    }

    async delete(id: string): Promise<void> {
        await this.productEntityRepository.delete(id);
    }

    async findAll(limit?: number, offset?: number): Promise<Product[]> {
        const entities = await this.productEntityRepository.find({ skip: offset, take: limit });
        return entities.map((entity) => this.toDomain(entity));
    }

    private toDomain(entity: ProductEntity): Product {
        return new Product(
            entity.id,
            entity.name,
            entity.description,
            entity.price,
            entity.category,
            entity.sellerId,
            entity.inventory,
            entity.isActive,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    private toEntity(product: Product): ProductEntity {
        const entity = new ProductEntity();
        entity.id = product.id;
        entity.name = product.name;
        entity.description = product.description;
        entity.price = product.price;
        entity.category = product.category;
        entity.sellerId = product.sellerId;
        entity.inventory = product.inventory;
        entity.isActive = product.isActive;
        entity.createdAt = product.createdAt;
        entity.updatedAt = product.updatedAt;
        return entity;
    }
}
