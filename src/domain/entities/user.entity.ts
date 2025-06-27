import { UserRole } from '../enums/user-role.enum';

export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly role: UserRole,
        private _passwordHash: string,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
    ) {}

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public isCustomer(): boolean {
        return this.role === UserRole.CUSTOMER;
    }

    public isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    public isSeller(): boolean {
        return this.role === UserRole.SELLER;
    }

    public canSellProducts(): boolean {
        return (this.isSeller() || this.isAdmin()) && this.isActive;
    }

    public getPasswordHash(): string {
        return this._passwordHash;
    }

    public updatePassword(password: string): void {
        this._passwordHash = password;
    }
}
