export class ProductUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly changes: {
            name?: string;
            description?: string;
            price?: number;
            inventory?: number;
        },
        public readonly updatedAt: Date = new Date(),
    ) {}
}
