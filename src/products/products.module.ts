import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductFeatured } from './products.entity';
// import { ProductBestSelling } from './products.entity';
// import { ProductTodayDeals } from './products.entity';
import { Category } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductFeatured, Category]),
    CategoryModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
