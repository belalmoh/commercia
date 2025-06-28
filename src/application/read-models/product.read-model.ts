export class ProductReadModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly category: string,
        public readonly categoryName: string, // ← Denormalized category name
        public readonly sellerId: string,
        public readonly sellerName: string, // ← Denormalized seller name
        public readonly inventory: number,
        public readonly isActive: boolean,
        public readonly averageRating: number, // ← Calculated field
        public readonly reviewCount: number, // ← Calculated field
        public readonly tags: string[], // ← Search optimization
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
