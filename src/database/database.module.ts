import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeatured } from '../products/products.entity';
// import { ProductBestSelling } from '../products/products.entity';
// import { ProductTodayDeals } from '../products/products.entity';
import { Category } from '../category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'your_username',
      password: 'your_password',
      database: 'your_database_name',
      entities: [ProductFeatured, Category], // Include Category entity
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProductFeatured, Category]),
  ],
})
export class DatabaseModule {}
