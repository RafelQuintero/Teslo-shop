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
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') //* Quiero manejar el id como un uuid y es del tipo string
  id: string;

  //*Titulo del producto en otra colunna
  @Column('text', {
    unique: true,
  }) //Dentro de los "()" del decoraodr, se indica para que  "typeORM",  no tome todos los dato
  //  ojo no todos son oportados por postgres
  // Despues de text le añado una regla que el titulo tiene que ser unico
  //* Nombre  para otra  columna
  //Nota: si modifco el titulo, como esta sincronozado me cambia automáticante en la base de datos.
  title: string;
  //definamos otra columna para el precio
  @Column('float', {
    //Valor por defecto del producto si no se especifica el precio.
    default: 0,
  })
  price: number; //definimos el precio del producto

  //Definimos otra columna definiendos la descripción del producto :Tecnica difernte del decoardor
  @Column({
    type: 'text',
    //Que acepte un valor nulo
    nullable: true,
  })
  description: string;

  //Definamos otra colunma llamada slup
  @Column('text', {
    unique: true,
    //No se colocó que no debe ser null, si furea null, lo indicaría como: nullable: true,
  })
  //  Me indica que es un url  del producto en la  aplicacion y debe ser único y no acepta valor null
  slug: string;

  // Columna para definer cuantos productos hay
  @Column('int', {
    // si no se especifca la cantidad que queda en stop sera:
    default: 0,
  })
  stock: number;

  // Colunma para definimo  la talla
  @Column('text', {
    //Se difine que es un arreglo de string
    array: true,
  })
  sizes: string[];

  //Columna para definir el genéro
  @Column('text')
  gender: string;
  //Luego se haran los tags . Que es agregar una nueva columna que se llame tags en la tabla product
  //que va a ser un arreglo de string.

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[]; //revisemos la tabla en la base dedatos y aparace tags.

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
}
