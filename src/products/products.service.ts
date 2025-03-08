import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';
import { Category } from 'src/category/category.entity';

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

    try {
      const queryBuilder = this.productFeaturedRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .take(size)
        .skip(offset);

      if (categoryId) {
        queryBuilder.andWhere('product.categoryId = :categoryId', {
          categoryId,
        });
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

      const products = await queryBuilder.getMany();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        'Failed to fetch products.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addProduct(productData: any) {
    const { section, categoryId, ...productDetails } = productData;

    try {
      let newProduct;
      let category = await this.getCategoryById(categoryId);

      newProduct = this.productFeaturedRepo.create({
        ...productDetails,
        category,
      });

      return await this.productFeaturedRepo.save(newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      throw new HttpException(
        'Failed to add product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    try {
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
    } catch (error) {
      console.error('Error updating product:', error);
      throw new HttpException(
        'Failed to update product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: number) {
    try {
      const deleteResult = await this.productFeaturedRepo.delete(id);

      if (deleteResult.affected === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new HttpException(
        'Failed to delete product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
