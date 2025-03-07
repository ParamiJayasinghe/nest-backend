import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductFeatured } from '../products/products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => ProductFeatured, (product) => product.category)
  products: ProductFeatured[];
}
