import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ProductReadModel } from '../../../application/read-models/product.read-model';
import { ProductReadModelEntity } from '../entities/product-read-model.entity';
import { ProductQueryRepository } from '../../../application/read-models/repositories/product-query.repository';

@Injectable()
export class TypeOrmProductQueryRepository implements ProductQueryRepository {
    constructor(
        @InjectRepository(ProductReadModelEntity)
        private readonly productReadModelEntityRepository: Repository<ProductReadModelEntity>,
    ) {}

    async findById(id: string): Promise<ProductReadModel | null> {
        const entity = await this.productReadModelEntityRepository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async findAll(limit: number, offset: number): Promise<ProductReadModel[]> {
        const entities = await this.productReadModelEntityRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return entities.map((entity) => this.toDomain(entity));
    }

    async findByCategory(category: string, limit: number, offset: number): Promise<ProductReadModel[]> {
        const entities = await this.productReadModelEntityRepository.find({
            where: { category, isActive: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return entities.map((entity) => this.toDomain(entity));
    }

    async findBySeller(sellerId: string, limit: number, offset: number): Promise<ProductReadModel[]> {
        const entities = await this.productReadModelEntityRepository.find({
            where: { sellerId, isActive: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return entities.map((entity) => this.toDomain(entity));
    }

    async updateFromEvent(productData: Partial<ProductReadModel>): Promise<void> {
        if (productData.id) {
            await this.productReadModelEntityRepository.upsert(this.toEntity(productData as any), ['id']);
        }
    }

    private toDomain(entity: ProductReadModelEntity): ProductReadModel {
        return new ProductReadModel(
            entity.id,
            entity.name,
            entity.description,
            entity.price,
            entity.category,
            entity.categoryName,
            entity.sellerId,
            entity.sellerName,
            entity.inventory,
            entity.isActive,
            entity.averageRating,
            entity.reviewCount,
            entity.tags,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    private toEntity(readModel: Partial<ProductReadModel>): Partial<ProductReadModelEntity> {
        const entity: Partial<ProductReadModelEntity> = {};

        if (readModel.id) entity.id = readModel.id;
        if (readModel.name) entity.name = readModel.name;
        if (readModel.description) entity.description = readModel.description;
        if (readModel.price !== undefined) entity.price = readModel.price;
        if (readModel.category) entity.category = readModel.category;
        if (readModel.categoryName) entity.categoryName = readModel.categoryName;
        if (readModel.sellerId) entity.sellerId = readModel.sellerId;
        if (readModel.sellerName) entity.sellerName = readModel.sellerName;
        if (readModel.inventory !== undefined) entity.inventory = readModel.inventory;
        if (readModel.isActive !== undefined) entity.isActive = readModel.isActive;
        if (readModel.averageRating !== undefined) entity.averageRating = readModel.averageRating;
        if (readModel.reviewCount !== undefined) entity.reviewCount = readModel.reviewCount;
        if (readModel.tags) entity.tags = readModel.tags;
        if (readModel.updatedAt) entity.updatedAt = readModel.updatedAt;

        return entity;
    }
}
