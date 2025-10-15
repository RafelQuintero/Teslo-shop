import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from '../product-image.entity';
//*Defiición de  entity: es la  representación del objeto "export class Product{}"en la base de datos ,
// //*representado  en una  tabla. Mdeidante el tyeORM
//TODO: Definicimes:
//? Un ORM(Objet RElation MApper), que conecta el mundo de los objetos
// ? con el mundo de las tablas en una base de datos.
//? Y el TyeORM, define tus identidades(clases) en TyoeScript y  esas clase se convierten en tablas
//?en la bse de datos.
//? Cada instancia de una clase corresponde a un registro en la fila,  que corresponde al
//? titula de cada columna.
//* Para que sea un Entity debo deconarlo "@Entity()"

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  //?expandieremos la informacion de este decorador "@ApiProperty({}) " mediante un objeto como parametro para decirle que es un id es un uuid
  @ApiProperty({
    example: '18bc6aba-b5da-4c45-8045-6a45970c2426',
    description: 'Product Id', //se describe que es un id
    uniqueItems: true, //unico el id
  })
  @PrimaryGeneratedColumn('uuid') //* Quiero manejar el id como un uuid y es del tipo string
  id: string;

  //*Titulo del producto en otra colunna
  @ApiProperty({
    example: 'T-Shirt Tesla',
    description: 'Product title', //se describe que es el tiulo del producto
    uniqueItems: true, //el titulo es unico
  })
  @Column('text', {
    unique: true,
  }) //Dentro de los "()" del decoraodr, se indica para que  "typeORM",  no tome todos los dato
  //  ojo no todos son oportados por postgres
  // Despues de text le añado una regla que el titulo tiene que ser unico
  //* Nombre  para otra  columna
  //Nota: si modifco el titulo, como esta sincronozado me cambia automáticante en la base de datos.
  title: string;
  //*definamos otra columna para el precio
  @ApiProperty({
    example: 0, //el precio por defecto es cero
    description: 'Product price', //Es  precio del producto
  })
  @Column('float', {
    //Valor por defecto del producto si no se especifica el precio.
    default: 0,
  })
  price: number; //definimos el precio del producto

  //*Definimos otra columna definiendos la descripción del producto :Tecnica difernte del decoardor
  @ApiProperty({
    example: 'Pantan', //se coloco como exmple que es un pantalon
    description: 'Pantalo od woman', //se describe que  un panatal para dama
    default: null, //  Indica que mo tiene descripcion
  })
  @Column({
    type: 'text',
    //Que acepte un valor nulo
    nullable: true,
  })
  description: string;

  //*Definamos otra colunma llamada slup
  @ApiProperty({
    example: 't_shirt_tesla', //se coloco un ejemplo
    description: 'Product SLUG - for SED', //se describe que es un slug
    uniqueItems: true, //unico el slug
  })
  @Column('text', {
    unique: true,
    //No se colocó que no debe ser null, si furea null, lo indicaría como: nullable: true,
  })
  //  Me indica que es un url  del producto en la  aplicacion y debe ser único y no acepta valor null
  slug: string;

  // *Columna para definer cuantos productos hay
  @ApiProperty({
    example: 10, //se coloco un ejemplo la cantidad de 10
    description: 'Product Stock', //se describe que es un slug
    default: 0, //valor por defecto en cero
  })
  @Column('int', {
    // si no se especifca la cantidad que queda en stop sera:
    default: 0,
  })
  stock: number;

  // *Colunma para definimo  la talla
  @ApiProperty({
    example: ['M', 'XL', 'XXL'], //se coloco un ejemplo del tamaño del objeto
    description: 'Product sizes', //se describe que el tamaño del producto
  })
  @Column('text', {
    //Se difine que es un arreglo de string
    array: true,
  })
  sizes: string[];

  //*Columna para definir el genéro
  @ApiProperty({
    example: 'women', //se coloco un ejemplo
    description: 'Product ', //se describe que es un slug
  })
  @Column('text')
  gender: string;
  //Luego se haran los tags . Que es agregar una nueva columna que se llame tags en la tabla product
  //que va a ser un arreglo de string.

  //*Columna para definir el tag
  @ApiProperty({
    example: 't_shirt_cocodrilo', //se coloco un ejemplo
    description: 'Product tag', //se describe que es una etiqueta
    uniqueItems: true, //unico el tag
  }) //AQui colocaremos este decorador en cada una del las columna de la identidad
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[]; //revisemos la tabla en la base de datos y aparace tags.

  // Tambien se haran lo images

  //*?Con este decorador @BeforeInsert() y @BeforeUpdate()
  //*? lo que hacemos es que antes de insertar o actualizar un registro.
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase() //lo paso a miniscula
      .replaceAll(' ', '_') //Lo remplazo los espacios por guion bajo
      .replaceAll("'", ''); //Eñ apostrofe (')lo sustityo por nada'
  }

  // @BeforeUpdate()
  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase() //lo paso a miniscula
      .replaceAll(' ', '_') //Lo remplazo los espacios por guion bajo
      .replaceAll("'", ''); //El apostrofe (')lo sustityo por nada'
  }
  //relacion de  un producto con muchas imagenes
  //
  @ApiProperty({
    example: 't_shirt_tesla-image', //se coloco un ejemplo de una foto de una camisa
    description: 'Product image', //se describe la imagen de prorudcot
  })
  @OneToMany(
    //debo decirle como me voy a
    // conectar con la otra tabla de imagenes
    () => ProductImage, //Tipo de relación regresa una instancia de ProductImage
    (productImage) => productImage.product, //Relacion inversa
    { cascade: true, eager: true }, //Si se borra un producto se borran sus imagenes
    //con el eager: true, cada vez que yo consulte un producto
    //  automaticamente me traiga sus imagenes
    //pro si eager: false, no me trae las imagenes automáticamente.
  )
  images?: ProductImage[]; //Un producto tiene muchas imagenes

  //**************/
  //* aqui no coloque  @ApiProperty() porque daria un error porque no tenemos establecida l relacion directamente
  @ManyToOne(
    () => User, //el primeer argumento relacion la tabla Product con la tabl User

    (user) => user.product,
    { eager: true }, //indiqo que carge el usuario que creo el producto.
  ) //el segundo argumento relaciono  un user (ususrio) con la taba product.
  user: User;

  //****** */
}

//todo: Primero crarermos la entidad de las imagenes
//todo;Ahora venamos como usaremos nuestras images
//todo:  cuando se reciba de esta manera
//TODO: en la proxima clase creareons  el usuario que cargo o crea el producto esto se hace
//todo: en los entity de producto y usuario se debe hacer la ralacion de dichas tablas.
//todo: un seed que nos permita reconstruir las tabla inclusive la de los  usuarios,
