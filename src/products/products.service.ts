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
import { DataSource, Repository } from 'typeorm';
//import { Product } from './entities/product.entity'; //Comentamos esta linea
//  porque importamos Product y ProductImage en la linea 16 , ya que estan en archivo index.ts
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

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
    private readonly productRepository: Repository<Product>, //se crea una propiedad "produtRepository"
    // y es de tipo "Repository"
    // y el tipo de dato que manejará es" <Product>"

    //?Creamos La inyeccion de dependencia
    //? para poder utilizar el repositorio de ProductImage y poder
    //? guardar las imagenes del producto.
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    //inyeccion del repositorio de dataSource para manejar las transacciones
    private readonly dataSource: DataSource,
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
      //? Desestructuramos el dto
      const { images = [], ...productDetails } = createProductDto; //desestructuramos el dto,
      //  es decir ,extraemos las imagenes del dto,
      // y le asignamos un valor por defecto que es un arreglo vacio
      //  y el resto de las propiedades las agrupo en una constante llamada productDetails
      //por medio del operador rest (...).

      //?
      //todo:  Cuando se crea el producto con las images,
      // todo: esta imagenes  debe ser una instancia de la entidad ProductImagepara que no sea un producto vacio
      const product = this.productRepository.create({
        ...productDetails, //*exparso cada una de las propiedades
        // * que vienen en el productDetails por medio del operador spred (...).
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        //*image:[],  Es un arreglo vacio , pero si hay imagenes,hagamos lo siguiente:
        // * Si hay imagenes, las mapeamos "map" y por cada imagen creamos una instancia de ProductImage
        // * y le asignamos la url de la imagen.
        // * estas debe ser una instancia de la entidad ProductImage (de esa tabla),
        // * Porque ahi tienen el: "id","url" y el  "productId"
      }); //Creamos el producto

      await this.productRepository.save(product); //GUardamos el producto creado  y tambien susimagenes
      //  y lo copio en la base de datos.

      //Devolvemos  el producto creado
      return { ...product, images: images }; //devolvemos el producto
      // devolvemos el producto, pero las imagenes las devolvemos como un arreglo de string
      // y no como un arreglo de objetos ProductImage
      // porque en el dto  las imagenes vienen como un arreglo de string.
      //y no como un arreglo de objetos ProductImage.
      //por eso hacemos la desestructuracion del product y le asignamos las imagenes
      //como vienen en el dto que es un arreglo de string.
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
        relations: { images: true }, //para que me traiga las imagenes relacionadas al producto
      });
      if (products.length === 0)
        throw new NotFoundException('No products found');

      return products.map(({ images, ...rest }) => ({
        //tambien podemos hacer la desestructuracion en de colocar product
        ...rest, //se sustituyo product por rest
        images: images?.map((img) => img.url) || [], //si product.images es
        //  undefined o null, devuelve un arreglo vacio
      })); //    `This action returns all products pero los quiero apanados`;
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
            .createQueryBuilder('product') //es el alias de la tabla/entidad en la  bae de datos.
            .where('UPPER(title) =:title or slug =:slug', {
              title: term.toUpperCase(), //hacemos la busqueda del titulo, que es el argumento que se le pasa
              //  sin importar mayusculas o minusculas
              slug: term.toLowerCase(), //hacemos la busqueda del slug que es el argumento que se le pasa
              //  sin importar mayusculas o minusculas
            })
            .leftJoinAndSelect('product.images', 'productImages') //Hacemos un left join con la tabla productImages
            //  para cargar las imagenes

            .getOne(); //getOne porque solo me va a devolver un registro,porque lo que busco es uno solo.

      if (!product)
        throw new NotFoundException(`Product with term: ${term} not found`);
      return product; //`This action returns a #${term} product` grantizandole que nunca será null con !;
    } catch (error) {
      //? Si el error es NOtFoundException. lo volvemos a lanzar patar que Nest devuelva
      //? 404
      if (error instanceof NotFoundException) {
        throw error;
      }
      //? 👇 Si es cualquier otro error (DB, lógica, etc),
      // ?lo manejamos como 500
      this.handDBExceptiion(error);
    }
  }

  //todo: Debemmos aplanar el reultado. es decir regresar solo lo que necesito que se muestre. en el resultado
  //todo: Por lo que crearemos un metodo privado que se encargue de aplanar el resultado.
  //todo: Lo pudemos uitlizar para hacer la buqueda de un solo producto
  // todo: y tambien para la busqueda de todos los productos.
  async findOnePlain(term: string) {
    //Para solucionar el problema de que las imagenes me las devuelve como un arreglo de objetos
    //  y no un undefine- o null, debemos ser expicito que si no consigue me envie el error
    //que lo causo.
    const product = await this.findOne(term);
    if (!product)
      throw new NotFoundException(`Product with term: ${term} not found`);

    const { images = [], ...rest } = product; //desestructuramos el producto
    // y le asignamos un valor por defecto que es un arreglo vacio
    //  y el resto de las propiedades las agrupo en una constante llamada rest
    //por medio del operador rest (...).
    //devolvemos el producto aplanado.
    return {
      ...rest,
      images: images.map((imge) => imge.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //TODO: Si actualizamos las images de un producto, debemos eliminar las imagenes que ya tiene.
    //todo. Para hacer esto tenemos que tener encuenta que  al  ejecutar dos tansacciones que no
    // todo: interconectadas entre si ,
    //todo: la eliminacion es una y la otra es la actualizacion.
    //todo: si una de las dos falla , debo indcarle al usuario que salio mal.
    //todo:conclision: las dos no deben fallar. y lo debo hacer  medante el query runner.
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

    //?Lo primero que voy hacer es extraer las
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      //devuelve una promesa, por lo que debe  tener un await
      //preload() me permite cargar un registro existente y actualizarlo con nuevos valores.
      id: id,
      ...toUpdate,
    });

    //chequemos si vienen images por medio de qury Runner() creremos la logica
    const cueryRunner = this.dataSource.createQueryRunner(); //esto es un objeto que tiene que conocer la cadena de conexion
    await cueryRunner.connect(); //establecemos la conexion
    await cueryRunner.startTransaction(); //iniciamos la transaccion

    try {
      if (!product)
        throw new NotFoundException(`Product with id ${id}not foaund`); // Se hioz esta valdiacion para suprimir
      // el error de undefine de typeScript

      if (images) {
        //con eeste if estoy obligando que venga el producto
        //si vienen imagenes, debo eliminar las que ya tiene el producto
        //? Eliminemos las imagenes que ya tiene el producto
        await cueryRunner.manager.delete(ProductImage, {
          product: { id: id }, //este id es el id del producto
        }); //eliminamos las imagenes que ya tiene el producto
        //? Ahora agreguemos las nuevas imagenes
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ); //creamos las nuevas imagenes
        //? y se las asignamos al producto
      }
      //Imapcteos la base de datos guardando el producto cn la nuevas imagenes
      await cueryRunner.manager.save(product); //guardamos el producto con las nuevas imagenes pero no loo hace todavia

      // await this.productRepository.save(product); //Actualizemos el producto  ya que devolvio una promesa.
      await cueryRunner.commitTransaction(); //si todo sale bien hace el commmit
      //await cueryRunner.release(); //hace los cambios, liberaamos la conexxion :lo clcoque en finally
      return this.findOnePlain(id); //sustituios  product; //si queremos mandar solo lo que se quiere la aplanamos por:
      // this.FindOnePlain()
    } catch (error) {
      // ?👇 Si el error es un NotFoundException, lo volvemos a lanzar para que Nest devuelva 404
      if (error instanceof NotFoundException) {
        throw error;
      }
      await cueryRunner.rollbackTransaction(); // rebirtio todo lo que se queir hacer ya que hubo um error.
      //await cueryRunner.release(); //libera el queryRunner. lo coloque en finally

      //Si ocurre un error , me envia  la informacion del error.que no sea un NotFoundException
      this.handDBExceptiion(error);
    } finally {
      await cueryRunner.release();
    }
  }

  async remove(id: string) {
    //todo: Queremos que cunado se borre u producto se borre las imagemes de este producto tambien,
    //todo; esto es lo que se llama borrar en cascada.
    //Comentamos la liniea de abajo
    // const product = await this.productRepository.findOneBy({ id: id });

    //Para hacer la buqueda del procuct, utilizando el método previnomente creado findOne(id)

    const product = await this.findOne(id); //usamos el metodo findOne que ya tiene la logica de busqueda y el manejo de errores.

    if (!product) {
      throw new NotFoundException(`the Product with that ${id} not found `);
    }
    // throw new NotFoundException(`Product with id ${id} not found`);

    await this.productRepository.remove(product);
    return `This action removes a #${id} product`;
  }

  //!++++++++++++++++++++++++++

  private handDBExceptiion(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  //!++++++++++++++++++++++++++++

  //?✅ PROCEIMIENTO BASTANTE DESTRUCTIVO.
  //?  crearemos un metodo; que si estamos en desarrollo lo utilzaremos , pero si estamos
  //? en produccion  no lo utlizaremos
  //?si alguna condicion extra se aplica lo podemos utilzar.

  // ?✅ TODO: Esto la voy a utilzar cuando creo la semilla para que me borre
  //? ✅ TODO:   prviamente todas la base de datos
  async deleteAllProducts() {
    //cramos una vinstancia llamada cuery
    const cuery = this.productRepository.createQueryBuilder('product');

    try {
      //si se boora un producto,, todos los demas tambien se van a borrar (esto es lo que se refiere en CASCADA) cascada
      return await cuery
        .delete()
        .where({}) //se le está diciendo que seleccione todos los productos
        .execute();
    } catch (error) {
      this.handDBExceptiion(error);
    }
  }
}
