import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  //* Para ver si se estan cargando las variable de etorno ".env"

  console.log('DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
    id_port: process.env.PORT,
  });

  //************* */

  //********** veamo que se vea la presentacion mejor en forma  de donde esá corriendo el puerto*/
  const logger = new Logger('bootstrap');

  //********** */

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
  logger.log(`Runing in the PORT:${process.env.PORT} `); //* hemos sustituido el console por logger
}
bootstrap();
