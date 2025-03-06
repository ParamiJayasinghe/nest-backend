import { Controller, Get, Query, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET: Fetch products with pagination and section filter
  @Get()
  async getProducts(
    @Query('section') section: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 4,
  ) {
    if (!section) {
      throw new HttpException('Section is required', HttpStatus.BAD_REQUEST);
    }
    return this.productsService.getProducts(section, page, size);
  }

  // POST: Add a new product
  @Post()
  async addProduct(@Body() productData: any) {
    if (!productData.section) {
      throw new HttpException('Section is required', HttpStatus.BAD_REQUEST);
    }
    return this.productsService.addProduct(productData);
  }

  // PUT: Update an existing product
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() productData: any) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    if (!productData.section) {
      throw new HttpException('Section is required', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.updateProduct(productId, productData);
  }

  // DELETE: Remove a product
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Query('section') section: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    if (!section) {
      throw new HttpException('Section is required', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.deleteProduct(productId, section);
  }
}
