import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private productsFilePath = path.join(__dirname, '../../Data/products.json');

  private readProductsFile() {
    const data = fs.readFileSync(this.productsFilePath, 'utf8');
    return JSON.parse(data);
  }

  getFeaturedProducts(page: number, size: number) {
    const data = this.readProductsFile();
    const featuredProducts = data.featuredProducts;
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    return featuredProducts.slice(startIndex, endIndex);
  }

  getBestSellingProducts(page: number, size: number) {
    const data = this.readProductsFile();
    const bestSellingProducts = data.bestSellingProducts;
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    return bestSellingProducts.slice(startIndex, endIndex);
  }

  getTodaysDeals(page: number, size: number) {
    const data = this.readProductsFile();
    const todayDeals = data.todayDeals;
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    return todayDeals.slice(startIndex, endIndex);
  }
}
