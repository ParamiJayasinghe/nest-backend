import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';
import { ProductBestSelling } from './products.entity';
import { ProductTodayDeals } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductFeatured)
    private readonly productFeaturedRepo: Repository<ProductFeatured>,

    @InjectRepository(ProductBestSelling)
    private readonly productBestSellingRepo: Repository<ProductBestSelling>,

    @InjectRepository(ProductTodayDeals)
    private readonly productTodayDealsRepo: Repository<ProductTodayDeals>,
  ) {}

  // GET: Fetch products from a specific section with pagination
  async getProducts(section: string, page: number, size: number) {
    let products: any[];
    const offset = page * size;

    try {
      switch (section) {
        case 'featured':
          products = await this.productFeaturedRepo.find({ take: size, skip: offset });
          break;
        case 'bestselling':
          products = await this.productBestSellingRepo.find({ take: size, skip: offset });
          break;
        case 'todaydeals':
          products = await this.productTodayDealsRepo.find({ take: size, skip: offset });
          break;
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException('Failed to fetch products.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST: Add a new product
  async addProduct(productData: any) {
    const { section, ...productDetails } = productData;

    try {
      switch (section) {
        case 'featured':
          return await this.productFeaturedRepo.save(productDetails);
        case 'bestselling':
          return await this.productBestSellingRepo.save(productDetails);
        case 'todaydeals':
          return await this.productTodayDealsRepo.save(productDetails);
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw new HttpException('Failed to add product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // PUT: Update an existing product
  async updateProduct(id: number, productData: any) {
    const { section, ...updatedProductDetails } = productData;

    try {
      let updatedProduct;
      switch (section) {
        case 'featured':
          await this.productFeaturedRepo.update(id, updatedProductDetails);
          updatedProduct = await this.productFeaturedRepo.findOne({ where: { id } });
          break;
        case 'bestselling':
          await this.productBestSellingRepo.update(id, updatedProductDetails);
          updatedProduct = await this.productBestSellingRepo.findOne({ where: { id } });
          break;
        case 'todaydeals':
          await this.productTodayDealsRepo.update(id, updatedProductDetails);
          updatedProduct = await this.productTodayDealsRepo.findOne({ where: { id } });
          break;
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }

      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new HttpException('Failed to update product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // DELETE: Remove a product
  async deleteProduct(id: number, section: string) {
    try {
      let deleteResult;
      switch (section) {
        case 'featured':
          deleteResult = await this.productFeaturedRepo.delete(id);
          break;
        case 'bestselling':
          deleteResult = await this.productBestSellingRepo.delete(id);
          break;
        case 'todaydeals':
          deleteResult = await this.productTodayDealsRepo.delete(id);
          break;
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }

      if (deleteResult.affected === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new HttpException('Failed to delete product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
