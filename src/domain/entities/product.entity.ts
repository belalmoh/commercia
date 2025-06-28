export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly category: string,
        public readonly sellerId: string,
        public readonly inventory: number,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
    ) {}

    public canBePurchased(quantity: number): boolean {
        return this.isActive && this.inventory >= quantity;
    }

    public reserveInventory(quantity: number): Product {
        if (!this.canBePurchased(quantity)) {
            throw new Error('Insufficient inventory or product inactive');
        }

        return new Product(
            this.id,
            this.name,
            this.description,
            this.price,
            this.category,
            this.sellerId,
            this.inventory - quantity,
            this.isActive,
            this.createdAt,
            new Date(),
        );
    }

    public calculateTotalPrice(quantity: number): number {
        return this.price * quantity;
    }
}
