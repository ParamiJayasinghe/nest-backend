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

  getProductsByCategory(category: string, page: number, size: number) {
    const data = this.readProductsFile();
    
    if (!data[category]) {
      throw new Error("Invalid category");
    }

    const products = data[category];
    const startIndex = page * size;
    const endIndex = startIndex + size;

    return products.slice(startIndex, endIndex);
  }
}