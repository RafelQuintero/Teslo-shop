import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  //?¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
  ///* Colocamos abajo deuseGlobalPipes ,  un codigo   de especificacio OpenAPI para describir la API RESTful. aprovechando los decoradores.
  //* uilizando  el apque de libreria @nestjs/swagger

  const config = new DocumentBuilder()
    .setTitle('Teslo Restful API') //Se le dio un nombre al titulo
    .setDescription('Teslo shop endpoint') //se le dio una descripción
    .setVersion('1.0') //Se puede establecer la versio , pero se dejo por defecto.
    //.addTag('cats') // se conemtará porque se va hacer de orta manera , esto  son agrupadores, ejemplo para agrupar todos lo que son productos
    .build(); //se deja por defecto.
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //Luego de hacer todas la modifucacionees |recargen la aplicaciók y valla  a la web y ejecuten localhost:3000/api ;
  //  con el puerto que configuraste la aplicacion.

  //?¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨

  await app.listen(process.env.PORT || 3000);
  logger.log(`Runing in the PORT:${process.env.PORT || 3000} `); //* hemos sustituido el console por logger
}
bootstrap();
