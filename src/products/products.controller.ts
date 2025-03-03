// products.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  getFeaturedProducts(
    @Query('page') page: string,
    @Query('size') size: string
  ) {
    const pageNumber = parseInt(page) || 0;
    const pageSize = parseInt(size) || 4;

    return this.productsService.getFeaturedProducts(pageNumber, pageSize);
  }

  // New route for Best Selling Products
  @Get('best-selling')
  getBestSellingProducts(
    @Query('page') page: string,
    @Query('size') size: string
  ) {
    const pageNumber = parseInt(page) || 0;
    const pageSize = parseInt(size) || 4;

    return this.productsService.getBestSellingProducts(pageNumber, pageSize);
  }

  // New route for Today's Deals
  @Get('today-deals')
  getTodaysDeals(
    @Query('page') page: string,
    @Query('size') size: string
  ) {
    const pageNumber = parseInt(page) || 0;
    const pageSize = parseInt(size) || 4;

    return this.productsService.getTodaysDeals(pageNumber, pageSize);
  }
}
