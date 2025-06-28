export class ProductCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly category: string,
        public readonly sellerId: string,
        public readonly inventory: number,
        public readonly createdAt: Date = new Date(),
    ) {}
}
