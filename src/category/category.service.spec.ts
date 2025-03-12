import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  //  Test findAll() method
  it('should return an array of categories', async () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Electronics' } as Category,
      { id: 2, name: 'Clothing' } as Category,
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(mockCategories);

    const result = await service.findAll();
    expect(result).toEqual(mockCategories);
    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  //  Test create() method
  it('should create and return a category', async () => {
    const categoryName = 'Books';
    const mockCategory: Category = { id: 3, name: categoryName } as Category;

    jest.spyOn(repository, 'create').mockReturnValue(mockCategory);
    jest.spyOn(repository, 'save').mockResolvedValue(mockCategory);

    const result = await service.create(categoryName);
    expect(result).toEqual(mockCategory);
    expect(repository.create).toHaveBeenCalledWith({ name: categoryName });
    expect(repository.save).toHaveBeenCalledWith(mockCategory);
  });

  // Test delete() method
  it('should delete a category by ID', async () => {
    const categoryId = '3';
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    await service.delete(categoryId);
    expect(repository.delete).toHaveBeenCalledWith(categoryId);
  });
});
