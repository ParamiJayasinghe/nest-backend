import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductFeatured } from './products.entity';
import { Category } from '../category/category.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: any;
  let categoryRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductFeatured),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get(getRepositoryToken(ProductFeatured));
    categoryRepo = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // COMMON TEST CASES FOR ADD & UPDATE
  describe('Category Validation', () => {
    it('should throw error if category is not found', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addProduct({
          section: 'featured',
          categoryId: 999,
          name: 'Product1',
          price: 100,
        }),
      ).rejects.toThrowError('Category not found');
    });
  });

  // GET PRODUCTS
  describe('getProducts', () => {
    it('should return products', async () => {
      const mockProducts = [{ id: 1, name: 'Product1' }];
      productRepo.createQueryBuilder().getMany.mockResolvedValue(mockProducts);

      const result = await service.getProducts('featured', 0, 10);
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error for invalid section', async () => {
      await expect(
        service.getProducts('invalid-section', 0, 10),
      ).rejects.toThrowError('Invalid section');
    });
  });

  //ADD PRODUCT
  describe('addProduct', () => {
    it('should add a product when category exists', async () => {
      const mockCategory = { id: 1, name: 'Category1' };
      const mockProduct = { id: 1, name: 'Product1', category: mockCategory };

      categoryRepo.findOne.mockResolvedValue(mockCategory);
      productRepo.create.mockReturnValue(mockProduct);
      productRepo.save.mockResolvedValue(mockProduct);

      const result = await service.addProduct({
        section: 'featured',
        categoryId: 1,
        name: 'Product1',
        price: 100,
      });

      expect(productRepo.create).toHaveBeenCalledWith({
        name: 'Product1',
        price: 100,
        category: mockCategory,
      });
      expect(productRepo.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  // UPDATE PRODUCT
  describe('updateProduct', () => {
    it('should update a product when found', async () => {
      const mockCategory = { id: 1, name: 'Category1' };
      const updatedProduct = {
        id: 1,
        name: 'Updated Product',
        category: mockCategory,
      };

      categoryRepo.findOne.mockResolvedValue(mockCategory);
      productRepo.findOne.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(1, {
        categoryId: 1,
        name: 'Updated Product',
      });

      expect(productRepo.update).toHaveBeenCalledWith(1, {
        name: 'Updated Product',
        category: mockCategory,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw error if product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateProduct(999, { name: 'Updated' }),
      ).rejects.toThrowError('Product not found');
    });
  });

  //DELETE PRODUCT
  describe('deleteProduct', () => {
    it('should delete product when found', async () => {
      productRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteProduct(1);
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw error if product not found', async () => {
      productRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteProduct(999)).rejects.toThrowError(
        'Product not found',
      );
    });
  });
});
