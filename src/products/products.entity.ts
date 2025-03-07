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

  @Column('int')
  rating: number;

  @Column('text')
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}

// @Entity('productsbestselling')
// export class ProductBestSelling {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column('text')
//   name: string;

//   @Column('double')
//   price: number;

//   @Column('int')
//   rating: number;

//   @Column('text')
//   image: string;
// }

// @Entity('productstodaydeals')
// export class ProductTodayDeals {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column('text')
//   name: string;

//   @Column('double')
//   originalPrice: number;

//   @Column('double')
//   discountedPrice: number;

//   @Column('text')
//   image: string;
// }
