import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductsQuery } from '../get-products.query';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { ProductReadModel } from '../../../read-models/product.read-model';
import { ProductQueryRepository } from '../../../read-models/repositories/product-query.repository';


@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
    constructor(@Inject('ProductQueryRepository') private readonly productQueryRepository: ProductQueryRepository) {}

    async execute(query: GetProductsQuery): Promise<ProductReadModel[]> {
        const { category, sellerId, limit, offset } = query;

        if(category) {
            return this.productQueryRepository.findByCategory(category, limit, offset);
        }

        if(sellerId) {
            return this.productQueryRepository.findBySellerId(sellerId, limit, offset);
        }

        return this.productQueryRepository.findAll(limit, offset);
    }
}

}