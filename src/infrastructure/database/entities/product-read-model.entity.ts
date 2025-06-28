import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('product_read_models')
export class ProductReadModelEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index() // Index for search
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @Index() // Index for price filtering
    price: number;

    @Column()
    @Index() // Index for category filtering
    category: string;

    @Column()
    categoryName: string;

    @Column()
    @Index() // Index for seller filtering
    sellerId: string;

    @Column()
    sellerName: string;

    @Column('int')
    inventory: number;

    @Column({ default: true })
    isActive: boolean;

    @Column('decimal', { precision: 3, scale: 2, default: 0 })
    averageRating: number;

    @Column('int', { default: 0 })
    reviewCount: number;

    @Column('text', { array: true, default: '{}' }) // PostgreSQL array
    tags: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
