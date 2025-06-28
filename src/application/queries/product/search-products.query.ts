export class SearchProductsQuery {
    constructor(
        public readonly searchTerm: string,
        public readonly category?: string,
        public readonly minPrice?: number,
        public readonly maxPrice?: number,
        public readonly limit: number = 10,
        public readonly offset: number = 0,
    ) {}
}
