import { EntityRepository, Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';

@EntityRepository(ProductFeatured)
export class ProductFeaturedRepository extends Repository<ProductFeatured> {}
