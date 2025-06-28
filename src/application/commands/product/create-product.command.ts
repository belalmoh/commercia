export class CreateProductCommand {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly category: string,
        public readonly sellerId: string,
        public readonly inventory: number,
    ) {}
}
