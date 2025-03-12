import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  // Test findAll() method
  it('should return an array of categories', async () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Electronics' } as Category,
      { id: 2, name: 'Clothing' } as Category,
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(mockCategories);

    const result = await controller.findAll();
    expect(result).toEqual(mockCategories);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  // Test create() method
  it('should create and return a category', async () => {
    const categoryName = 'Books';
    const mockCategory: Category = { id: 3, name: categoryName } as Category;

    jest.spyOn(service, 'create').mockResolvedValue(mockCategory);

    const result = await controller.create(categoryName);
    expect(result).toEqual(mockCategory);
    expect(service.create).toHaveBeenCalledWith(categoryName);
  });

  // Test delete() method
  it('should delete a category by ID', async () => {
    const categoryId = '3';
    jest.spyOn(service, 'delete').mockResolvedValue(undefined);

    await controller.delete(categoryId);
    expect(service.delete).toHaveBeenCalledWith(categoryId);
  });
});
