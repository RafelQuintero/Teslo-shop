import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //* debemos inportar un Modulo
  imports: [
    //Recuerde que solo hay un solo .forRoot() y ya existe en aap.Module.ts por lo que se inport es:
    TypeOrmModule.forFeature([
      //Definimos  en este arregl  o,todas la identidaes que se estan definiendo el entity
      Product,
    ]),
  ],
})
export class ProductsModule {}
