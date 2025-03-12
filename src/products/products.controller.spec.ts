import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
            addProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  //  GET /products - Missing Required Section
  it('should throw a BAD_REQUEST error if section is missing in getProducts', async () => {
    await expect(controller.getProducts(undefined, 0, 4)).rejects.toThrow(
      new HttpException('Section is required', HttpStatus.BAD_REQUEST),
    );
  });

  //  POST /products - Missing Category ID
  it('should throw a BAD_REQUEST error if categoryId is missing in addProduct', async () => {
    const productData = { name: 'Test Product', price: 100 };

    await expect(controller.addProduct(productData)).rejects.toThrow(
      new HttpException('Category ID is required', HttpStatus.BAD_REQUEST),
    );
  });

  //  DELETE /products/:id - Invalid Product ID
  it('should throw a BAD_REQUEST error if product ID is invalid in deleteProduct', async () => {
    await expect(controller.deleteProduct('abc')).rejects.toThrow(
      new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST),
    );
  });
});
