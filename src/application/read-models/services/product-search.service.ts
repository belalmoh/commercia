import { ProductReadModel } from '../product.read-model';

export interface SearchFilter {
    term: string;
    category?: string;
    priceRange?: {
        min?: number;
        max?: number;
    };
    pagination: {
        limit: number;
        offset: number;
    };
}

export interface ProductSearchService {
    search(filter: SearchFilter): Promise<ProductReadModel[]>;
    indexProduct(product: ProductReadModel): Promise<void>;
    removeProduct(productId: string): Promise<void>;
}
