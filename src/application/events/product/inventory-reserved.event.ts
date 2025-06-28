export class InventoryReservedEvent {
    constructor(
        public readonly productId: string,
        public readonly quantity: number,
        public readonly userId: string,
        public readonly remainingInventory: number,
        public readonly reservedAt: Date = new Date(),
    ) {}
}
