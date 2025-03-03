import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products/products.controller';
import {ProductsService } from './products/products.service';

describe('AppController', () => {
  let appController: ProductsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    appController = app.get<ProductsController>(ProductsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getFeaturedProducts("4","4")).toBe('Hello World!');
    });
  });
});
