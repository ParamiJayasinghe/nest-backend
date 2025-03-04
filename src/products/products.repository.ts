// src/products/products.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';
import { ProductBestSelling } from './products.entity';
import { ProductTodayDeals } from './products.entity';

@EntityRepository(ProductFeatured)
export class ProductFeaturedRepository extends Repository<ProductFeatured> {}

@EntityRepository(ProductBestSelling)
export class ProductBestSellingRepository extends Repository<ProductBestSelling> {}

@EntityRepository(ProductTodayDeals)
export class ProductTodayDealsRepository extends Repository<ProductTodayDeals> {}
