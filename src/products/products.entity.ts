// src/products/products.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productsfeatured')
export class ProductFeatured {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('double')
  price: number;

  @Column('int')
  rating: number;

  @Column('text')
  image: string;
}

@Entity('productsbestselling')
export class ProductBestSelling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('double')
  price: number;

  @Column('int')
  rating: number;

  @Column('text')
  image: string;
}

@Entity('productstodaydeals')
export class ProductTodayDeals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('double')
  originalPrice: number;

  @Column('double')
  discountedPrice: number;

  @Column('text')
  image: string;
}
