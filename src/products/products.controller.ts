import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('section') section: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 4,
  ) {
    return this.productsService.getProducts(section, page, size);
  }
}
