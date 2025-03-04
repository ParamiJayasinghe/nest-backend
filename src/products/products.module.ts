// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductFeatured } from './products.entity';  // Correctly import entities
import { ProductBestSelling } from './products.entity';
import { ProductTodayDeals } from './products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeatured, ProductBestSelling, ProductTodayDeals])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
