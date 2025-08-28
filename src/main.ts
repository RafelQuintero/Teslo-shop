import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  //* Para ver si se estan cargando las variable de etorno ".env"

  console.log('DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
  });

  //************* */

  const app = await NestFactory.create(AppModule);

  //****Agregremos el api  para la ruta de manera global */

  app.setGlobalPrefix('api');

  //*+++++++++++++

  //*******Agrgamso codigo para hacer las validacioe de lo PIPES globalmente. */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //********* */

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Runing in the PORT: 3000`);
}
bootstrap();
