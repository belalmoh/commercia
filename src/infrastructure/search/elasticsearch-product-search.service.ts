import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductReadModel } from '../../application/read-models/product.read-model';
import { ProductSearchService, SearchFilter } from '../../application/read-models/services/product-search.service';

@Injectable()
export class ElasticsearchProductSearchService implements ProductSearchService {
    private readonly index = 'products';

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async search(filter: SearchFilter): Promise<ProductReadModel[]> {
        const body = this.buildSearchQuery(filter);

        try {
            const response = await this.elasticsearchService.search({
                index: this.index,
                ...body,
            });

            return response.hits.hits.map((hit: any) => this.mapToReadModel(hit._source));
        } catch (error) {
            console.error('Elasticsearch search error:', error);
            return [];
        }
    }

    async indexProduct(product: ProductReadModel): Promise<void> {
        try {
            await this.elasticsearchService.index({
                index: this.index,
                id: product.id,
                document: this.mapToElasticsearchDocument(product),
            });
        } catch (error) {
            console.error('Elasticsearch indexing error:', error);
        }
    }

    async removeProduct(productId: string): Promise<void> {
        try {
            await this.elasticsearchService.delete({
                index: this.index,
                id: productId,
            });
        } catch (error) {
            console.error('Elasticsearch deletion error:', error);
        }
    }

    private buildSearchQuery(filter: SearchFilter) {
        const must: any[] = [{ term: { isActive: true } }];

        // Text search
        if (filter.term) {
            must.push({
                multi_match: {
                    query: filter.term,
                    fields: ['name^3', 'description^2', 'tags'], // Boost name field
                    fuzziness: 'AUTO',
                },
            });
        }

        // Category filter
        if (filter.category) {
            must.push({ term: { category: filter.category } });
        }

        // Price range filter
        if (filter.priceRange?.min !== undefined || filter.priceRange?.max !== undefined) {
            const priceRange: any = {};
            if (filter.priceRange.min !== undefined) priceRange.gte = filter.priceRange.min;
            if (filter.priceRange.max !== undefined) priceRange.lte = filter.priceRange.max;

            must.push({ range: { price: priceRange } });
        }

        return {
            query: { bool: { must } },
            sort: ['_score:desc', 'averageRating:desc', 'createdAt:desc'],
            from: filter.pagination.offset,
            size: filter.pagination.limit,
        };
    }

    private mapToElasticsearchDocument(product: ProductReadModel) {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            categoryName: product.categoryName,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            inventory: product.inventory,
            isActive: product.isActive,
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
            tags: product.tags,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }

    private mapToReadModel(doc: any): ProductReadModel {
        return new ProductReadModel(
            doc.id,
            doc.name,
            doc.description,
            doc.price,
            doc.category,
            doc.categoryName,
            doc.sellerId,
            doc.sellerName,
            doc.inventory,
            doc.isActive,
            doc.averageRating,
            doc.reviewCount,
            doc.tags || [],
            new Date(doc.createdAt),
            new Date(doc.updatedAt),
        );
    }
}
