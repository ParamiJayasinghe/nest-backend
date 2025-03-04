import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFeaturedRepository } from './products.repository';
import { ProductBestSellingRepository } from './products.repository';
import { ProductTodayDealsRepository } from './products.repository';
import { ProductFeatured } from './products.entity';
import { ProductBestSelling } from './products.entity';
import { ProductTodayDeals } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductFeatured)
    private productFeaturedRepo: ProductFeaturedRepository,

    @InjectRepository(ProductBestSelling)
    private productBestSellingRepo: ProductBestSellingRepository,

    @InjectRepository(ProductTodayDeals)
    private productTodayDealsRepo: ProductTodayDealsRepository,
  ) {}

  // New method to fetch data from different tables (Featured, Best Selling, Today's Deals)
  async getProducts(section: string, page: number, size: number) {
    let products: any[];

    const offset = page * size;
    
    switch (section) {
      case 'featured':
        products = await this.productFeaturedRepo.find({
          take: size,
          skip: offset,
        });
        break;
      case 'bestselling':
        products = await this.productBestSellingRepo.find({
          take: size,
          skip: offset,
        });
        break;
      case 'todaydeals':
        products = await this.productTodayDealsRepo.find({
          take: size,
          skip: offset,
        });
        break;
      default:
        throw new Error('Invalid section');
    }

    return products;
  }
}
