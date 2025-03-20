import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Category> {
    const updatedCategory = await this.categoryService.update(id, name);

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return updatedCategory;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
