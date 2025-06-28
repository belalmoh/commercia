export class GetProductsQuery {
    constructor(
        public readonly category?: string,
        public readonly sellerId?: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0,
    ) {}
}
