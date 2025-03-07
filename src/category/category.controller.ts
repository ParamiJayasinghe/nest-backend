import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Post()
  async create(@Body('name') name: string): Promise<Category> {
    return this.categoryService.create(name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
