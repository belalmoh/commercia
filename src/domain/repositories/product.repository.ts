import { Product } from '../entities/product.entity';

export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    findByCategory(category: string): Promise<Product[]>;
    findBySellerId(sellerId: string): Promise<Product[]>;
    save(product: Product): Promise<Product>;
    delete(id: string): Promise<void>;
}
