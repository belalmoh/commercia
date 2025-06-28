import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SearchProductsQuery } from '../search-products.query';
import { ProductReadModel } from '../../../read-models/product.read-model';
import { ProductSearchService } from '../../../read-models/services/product-search.service';

@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler implements IQueryHandler<SearchProductsQuery> {
    constructor(@Inject('ProductSearchService') private readonly productSearchService: ProductSearchService) {}

    async execute(query: SearchProductsQuery): Promise<ProductReadModel[]> {
        return this.productSearchService.search({
            term: query.searchTerm,
            category: query.category,
            priceRange: {
                min: query.minPrice,
                max: query.maxPrice,
            },
            pagination: {
                limit: query.limit,
                offset: query.offset,
            },
        });
    }
}
