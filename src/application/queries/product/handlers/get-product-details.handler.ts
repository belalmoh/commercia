import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProductDetailsQuery } from '../get-product-details.query';
import { ProductReadModel } from 'src/application/read-models/product.read-model';
import { ProductQueryRepository } from 'src/application/read-models/repositories/product-query.repository';

@QueryHandler(GetProductDetailsQuery)
export class GetProductDetailsHandler implements IQueryHandler<GetProductDetailsQuery> {
    constructor(
        @Inject('ProductQueryRepository')
        private readonly productQueryRepository: ProductQueryRepository,
    ) {}

    async execute(query: GetProductDetailsQuery): Promise<ProductReadModel> {
        const product = await this.productQueryRepository.findById(query.id);
        if (!product) {
            throw new NotFoundException(`Product with id ${query.id} not found`);
        }
        return product;
    }
}
