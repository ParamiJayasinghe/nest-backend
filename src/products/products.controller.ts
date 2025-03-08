import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('section') section: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 4,
    @Query('categoryId') categoryId?: number,
  ) {
    if (!section) {
      throw new HttpException('Section is required', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.getProducts(section, page, size, categoryId);
  }

  @Post()
  async addProduct(@Body() productData: any) {
    if (!productData.categoryId) {
      throw new HttpException(
        'Category ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.productsService.addProduct(productData);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() productData: any) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.updateProduct(productId, productData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    return this.productsService.deleteProduct(productId);
  }
}
