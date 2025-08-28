/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //* previamnete se instalo desde la terminal.
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //Disponible en todo el proyecto
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!, //Con el + lo converto en un nimerp, cone ! le digo que viene un númro
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, //Carga automaticamente la edentidades que vamos definiendo
      synchronize: true, // en produccion  no se usa (false), esto lo que hace si se crea algun cambio en alguna indetidades este las sicroniza automáticamente:
    }),
    ProductsModule,
    CommonModule,
  ], // Listo ya podemos manejar las variable de entorno establecidas.
  providers: [],
})
export class AppModule {}

// Proximo paso instalra la base de datos
