import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepository.find();
  }

  async create(name: string): Promise<Category> {
    const category = this.categoryRepository.create({ name });
    return this.categoryRepository.save(category);
  }

  async update(id: string, name: string): Promise<Category | null> {
    const categoryId = parseInt(id, 10); // Convert id to number if needed
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return null;
    }

    category.name = name;
    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(parseInt(id, 10)); // Convert to number if needed
  }
}
