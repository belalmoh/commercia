export class GetProductDetailsQuery {
    constructor(
        public readonly id: string,
        public readonly userId?: string, // For personalized data
    ) {}
}
