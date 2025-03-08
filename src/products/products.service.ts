import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFeatured } from './products.entity';
// import { ProductBestSelling } from './products.entity';
// import { ProductTodayDeals } from './products.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductFeatured)
    private readonly productFeaturedRepo: Repository<ProductFeatured>,

    // @InjectRepository(ProductBestSelling)
    // private readonly productBestSellingRepo: Repository<ProductBestSelling>,

    // @InjectRepository(ProductTodayDeals)
    // private readonly productTodayDealsRepo: Repository<ProductTodayDeals>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // GET: Fetch products from a specific section with pagination and category filtering
  async getProducts(
    section: string,
    page: number,
    size: number,
    categoryId?: number,
  ) {
    let products: any[];
    const offset = page * size;

    try {
      const queryOptions: any = {
        take: size,
        skip: offset,
        relations: ['category'], // Ensure category is joined
      };

      if (categoryId) {
        queryOptions.where = { category: { id: categoryId } }; // Add category filter if categoryId is provided
      }

      switch (section) {
        case 'featured':
          products = await this.productFeaturedRepo.find(queryOptions);
          break;
        // case 'bestselling':
        //   products = await this.productBestSellingRepo.find(queryOptions);
        //   break;
        // case 'todaydeals':
        //   products = await this.productTodayDealsRepo.find(queryOptions);
        //   break;
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        'Failed to fetch products.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST: Add a new product with categoryId
  async addProduct(productData: any) {
    const { section, categoryId, ...productDetails } = productData;

    try {
      let newProduct;
      let category;

      // Fetch category by id
      category = await this.getCategoryById(categoryId);

      switch (section) {
        case 'featured':
          newProduct = this.productFeaturedRepo.create({
            ...productDetails,
            category,
          });
          return await this.productFeaturedRepo.save(newProduct);
        // case 'bestselling':
        //   newProduct = this.productBestSellingRepo.create({
        //     ...productDetails,
        //     category,
        //   });
        //   return await this.productBestSellingRepo.save(newProduct);
        // case 'todaydeals':
        //   newProduct = this.productTodayDealsRepo.create({
        //     ...productDetails,
        //     category,
        //   });
        //   return await this.productTodayDealsRepo.save(newProduct);
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw new HttpException(
        'Failed to add product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method to fetch Category by ID
  // Helper method to fetch Category by ID
  private async getCategoryById(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId }, // Use the 'where' option to specify the condition
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    return category;
  }
  // PUT: Update an existing product, including categoryId
  async updateProduct(id: number, productData: any) {
    const { section, categoryId, ...updatedProductDetails } = productData;

    try {
        let updatedProduct;
        let category = null;

        // Fetch category only if categoryId is provided
        if (categoryId) {
            category = await this.getCategoryById(categoryId);
        }

        switch (section) {
            case 'featured':
                await this.productFeaturedRepo.update(id, {
                    ...updatedProductDetails,
                    ...(category ? { category } : {}), // Only add category if provided
                });
                updatedProduct = await this.productFeaturedRepo.findOne({
                    where: { id },
                    relations: ['category'],
                });
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
        throw new HttpException(
            'Failed to update product.',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
        // case 'bestselling':
        //   deleteResult = await this.productBestSellingRepo.delete(id);
        //   break;
        // case 'todaydeals':
        //   deleteResult = await this.productTodayDealsRepo.delete(id);
        //   break;
        default:
          throw new HttpException('Invalid section', HttpStatus.BAD_REQUEST);
      }

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
