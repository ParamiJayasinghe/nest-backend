import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('productsfeatured')
export class ProductFeatured {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('double')
  price: number;

  @Column('double', { nullable: true })
  discountPrice: number | null;

  @Column('int', { default: 0 })
  soldItems: number;

  @Column('int')
  rating: number;

  @Column('text')
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
