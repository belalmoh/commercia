import { ProductReadModel } from '../product.read-model';

export interface ProductQueryRepository {
    findById(id: string): Promise<ProductReadModel | null>;
    findAll(limit: number, offset: number): Promise<ProductReadModel[]>;
    findByCategory(category: string, limit: number, offset: number): Promise<ProductReadModel[]>;
    findBySeller(sellerId: string, limit: number, offset: number): Promise<ProductReadModel[]>;
    updateFromEvent(productData: Partial<ProductReadModel>): Promise<void>;
}
