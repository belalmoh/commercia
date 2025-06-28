export class ReserveInventoryCommand {
    constructor(
        public readonly productId: string,
        public readonly quantity: number,
        public readonly userId: string,
    ) {}
}
