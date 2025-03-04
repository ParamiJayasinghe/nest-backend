// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatured } from '../products/products.entity';  // Import product entities
import { ProductBestSelling } from '../products/products.entity';
import { ProductTodayDeals } from '../products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // MySQL host
      port: 3306,        // MySQL port
      username: 'your_username', // MySQL username
      password: 'your_password', // MySQL password
      database: 'your_database_name', // Your database name
      entities: [ProductFeatured, ProductBestSelling, ProductTodayDeals], // Include your entities here
      synchronize: true, // Automatically create database tables
    }),
    TypeOrmModule.forFeature([ProductFeatured, ProductBestSelling, ProductTodayDeals]),  // Register entities
  ],
})
export class DatabaseModule {}
