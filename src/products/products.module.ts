import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
//TODO:  Como tengo dos imprtaciones  de un mismo archivo; product-image.entity.ts , puedo hacer
// una sola importacion  y separarlas por comas, como se ve arriba.
//creando un archiovo index.ts en la carpeta entities.
import { Product, ProductImage } from './entities';
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //* debemos inportar un Modulo
  imports: [
    //Recuerde que solo hay un solo .forRoot() y ya existe en aap.Module.ts por lo que se inport es:
    TypeOrmModule.forFeature([
      //Definimos  en este arreglo  o,todas la identidades que se estan definiendo el entity
      Product,
      ProductImage, // 👉 IMPORTANTE: Usualmente tambien esto se importa para utilizar ProductReposiry u ProdcutImageReposory
    ]),
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
