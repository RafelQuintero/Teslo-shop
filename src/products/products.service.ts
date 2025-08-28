import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  //Debemos trabajar con el patron repositorio para hacer la iteración con la base de datos en las tablas.,
  //Ya está creado por defecto por Nestjs
  //usameos el patron reositorio para que nos ayude a ser la insercion de datos en las tablas.
  //cramos el producto

  //? Crearemos una propeidad privadoa que solo la uilzaremso aquie para manejar los errores
  //? y me dira en que servixio ocurrió.

  private readonly logger = new Logger('ProductsService'); //Importemos Logger de nest vease linea 1

  //*Logger(), Logger sirve para imprimir logs (mensajes de consola
  // *con diferentes niveles: log, error, warn, debug, verbose)
  // * detro de logger ponemos como parametros el contexto que vamos a untilizar que es la clase ProductsService.

  //?++++++++++++++++

  // Creamos el constructor para que podamos inectar el repositorio

  constructor(
    //Aqui inyectamos el repositorio
    @InjectRepository(Product) // aqui inyectanos la indentidad, colocado en el parametro llamodo: "Product", que es nuestra identidad.
    private readonly productRepository: Repository<Product>, //se crea una propiedad "produtRepository" // y es de tipo "Repository" // y el tipo de dato que manejará es" <Product>"
  ) {}

  async create(createProductDto: CreateProductDto) {
    //Debe ser asyncronio porque la interacion con la base de daatos son asyncronos.

    try {
      //todo: eL CODIGO QUE ESTÁ COMENTADO SERA  sustituido por un decoardor llamdo @BeforeInsert()
      //TODO,   que sera colocado  en la entidad, que está en una funcion llamada checkSlugInsert()
      //TODO QUE SE CREO EN LA ENTIDAD product.entity.ts
      //? Esto es para que si no llega el slug, se cree automaticamente.
      //? Si llega el slug, se formatee.

      // if (!createProductDto.slug) {
      //  createProductDto.slug = product.title
      //.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
      //} else {
      // createProductDto.slug = createProductDto.slug
      // .toLowerCase().replaceAll(' ', '_').replaceAll("'", '');

      //todo: Fin de lo que se comentó

      const product = this.productRepository.create(createProductDto); //Creamos el producto

      await this.productRepository.save(product); //GUardamos el producto creado y lo copio en la base de datos.

      //Devolvemos  el producto creado
      return product;
    } catch (error) {
      //*Indiqeumos el tipo de error que está ocurriendo utilzando logger, para saber
      // *  mandar el error y en que servico de la clase ocurrio.

      // this.logger.error(error);
      // console.log(error); replazado por logger
      // throw new InternalServerErrorException('Help');
      //Lo anterior lo sustituyo por:
      this.handDBExceptiion(error);
      //Quedando el codigo del error en una sola línea.
    }

    //return 'This action adds a new product';
  }
  //TODO: PAginar no se olvide de hacerlo
  //todo: listo
  async findAll(PaginationDto: PaginationDto) {
    try {
      //paginemos la consulta en la consulta de products en la base de datos.
      const { limit = 10, offset = 0 } = PaginationDto;
      const products = await this.productRepository.find({
        take: limit, //toma toda la cantidad de datos que le indiquemos en limit
        skip: offset, //saltate los datos que le indiquemos en offset
        //TODO: Relaciones
      });
      if (products.length === 0)
        throw new NotFoundException('No products found');

      return products; //    `This action returns all products`;
    } catch (error) {
      this.handDBExceptiion(error);
    }
  }

  async findOne(term: string) {
    try {
      //hicimos el comentario de la linea de abajo "105" porque no siempre el termino va a ser un id
      //y si no es un id, el findOneBy me devolverá null y eso no es bueno.
      //ademas el id es un uuid y no un numero.
      // const product = await this.productRepository.findOneBy({ id: term });

      //Instalemos la libreria "isUUID" para validar si el termino es un UUID
      //Hagamos la validacion previamente evitemos  que Product de un null
      //uilizando un ternario y asignadloe a una variable product que es cosntante.
      const product = isUUID(term)
        ? await this.productRepository.findOneBy({ id: term })
        : //: await this.productRepository.findOneBy({ slug: term });
          await this.productRepository
            .createQueryBuilder('product') //es el alias de la tabla/entidad en la
            .where('UPPER(title) =:title or slug =:slug', {
              title: term.toUpperCase(), //hacemos la busqueda del titulo, que es el argumento que se le pasa
              //  sin importar mayusculas o minusculas
              slug: term.toLowerCase(), //hacemos la busqueda del slug que es el argumento que se le pasa
              //  sin importar mayusculas o minusculas
            })
            .getOne(); //getOne porque solo me va a devolver un registro,porque lo que busco es uno solo.

      if (!product)
        throw new NotFoundException(`Product with term: ${term} not found`);
      return product; //`This action returns a #${term} product` grantizandole que nunca será null con !;
    } catch (error) {
      this.handDBExceptiion(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // se debe revisar el  @BeforeUpdate() en la entidad product.entity.ts
    //El id es string porque es uuid
    //preload() me permite cargar un registro existente y actualizarlo con nuevos valores.
    //Lalineas de codigo 137 al 143 no hacen falta porque ya lo hace el @BeforeUpdate()
    // en la entidad product.entity.ts
    // const updateProductDtoSlug = updateProductDto.slug;
    // if (updateProductDtoSlug) {
    //   updateProductDto.slug = updateProductDtoSlug
    //     .toLowerCase() //lo paso a miniscula
    //     .replaceAll(' ', '_') //Lo remplazo los espacios por guion bajo
    //     .replaceAll("'", ''); //El apostrofe (')lo sustityo por nada'
    // }
    //si no viene el slug, no hago nada, porque ya lo hace el @BeforeUpdate() en la entidad product.entity.ts
    //si viene el slug, lo formateo como debe ser.

    const product = await this.productRepository.preload({
      //devuelve una promesa, por lo que debe  tener un await
      //preload() me permite cargar un registro existente y actualizarlo con nuevos valores.
      id: id,
      ...updateProductDto,
    });
    //chequemos si el producto existe es decir; si preload no encontro la entidad, devuelve un undefined

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    //si el producto existe, lo guardamos
    try {
      await this.productRepository.save(product); //Actualizemos el producto  ya que devolvio una promesa.
      return product;
    } catch (error) {
      this.handDBExceptiion(error);
    }
  }

  async remove(id: string) {
    //Comntamos la liniea de abajo
    // const product = await this.productRepository.findOneBy({ id: id });

    //Para hacer la buqueda del procuct, utilizando el método previnomente creado findOne(id)
    const product = await this.findOne(id); //usamos el metodo findOne que ya tiene la logica de busqueda y el manejo de errores.

    if (!product)
      throw new BadRequestException(`Product with id ${id} not found`);

    await this.productRepository.remove(product);
    return `This action removes a #${id} product`;
  }
  //? Para buscar el producto por el tutulo utilizaremosn  el QueryBuilder de typeORM
  //? que nos permite hacer consultas mas complejas.

  //* Crearemos un metodo apra manejar los tipos de errore que ocurran.
  // * Este metodo solo se podrá utilzar en esta clase ya que declara privado.

  private handDBExceptiion(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
