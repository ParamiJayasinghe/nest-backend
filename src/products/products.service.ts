import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductFeatured)
    private readonly productFeaturedRepo: Repository<ProductFeatured>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getProducts(
    section: string,
    page: number,
    size: number,
    categoryId?: number,
  ) {
    const offset = page * size;
    const queryBuilder = this.productFeaturedRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .take(size)
      .skip(offset);

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (section === 'best-selling') {
      queryBuilder.andWhere('product.soldItems > :soldThreshold', {
        soldThreshold: 500,
      });
    } else if (section === 'todays-deals') {
      queryBuilder.andWhere('product.discountPrice IS NOT NULL');
    } else if (section !== 'featured') {
      throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
    }

    return queryBuilder.getMany();
  }

  async addProduct(productData: any) {
    const { section, categoryId, ...productDetails } = productData;
    const category = await this.getCategoryById(categoryId);

    const newProduct = this.productFeaturedRepo.create({
      ...productDetails,
      category,
    });

    return this.productFeaturedRepo.save(newProduct);
  }

  private async getCategoryById(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    return category;
  }

  async updateProduct(id: number, productData: any) {
    const { categoryId, ...updatedProductDetails } = productData;

    let category = null;
    if (categoryId) {
      category = await this.getCategoryById(categoryId);
    }

    await this.productFeaturedRepo.update(id, {
      ...updatedProductDetails,
      ...(category ? { category } : {}),
    });

    const updatedProduct = await this.productFeaturedRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!updatedProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return updatedProduct;
  }

  async deleteProduct(id: number) {
    const deleteResult = await this.productFeaturedRepo.delete(id);

    if (deleteResult.affected === 0) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Product deleted successfully' };
  }
}
