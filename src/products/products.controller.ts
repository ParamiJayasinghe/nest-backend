import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query('category') category: string,
    @Query('page') page: string,
    @Query('size') size: string
  ) {
    const pageNumber = parseInt(page) || 0;
    const pageSize = parseInt(size) || 4;

    return this.productsService.getProductsByCategory(category, pageNumber, pageSize);
  }
}