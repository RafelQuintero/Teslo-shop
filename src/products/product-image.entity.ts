//?Creamos la nueva identidad para las imagenes de los productos,
// //? que es como se va a ver en la base de datos.
//creams la clase   sin el nombre del tipo de datos  (  entity ),
// porque no queremos que en la base de datos se vea ese nombre de ProductImageEntity.

//Creamos la clase  pero debemos importarla de typeorm
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './entities';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn() //El id se genera automaticamente ya que no se le indico
  //que tipo de dato es, dentro del parentesis.
  id: number; // El id debe ser único

  @Column('text') //El tipo de dato que va a tener la columna.
  // El registro de la columna es obligatorio. no uede venir un "null"
  url: string;
  //Estos osn los campos que quiero en mi tabala de la base de datos.

  //Un producto puede tener muchas imagenes, pero una imagen solo puede pertenecer a un producto
  //Entonces en la entidad de la imagen se define la relación muchos a uno
  //y en la entidad del producto se define la relación uno a muchos.
  @ManyToOne(
    () => Product, //Tipo de relación regresa una instancia de Product
    (product) => product.images, //Relacion inversa. Se relaciona las imagens com el producto.
    { onDelete: 'CASCADE' }, //todo: debo decirle como quiero que se booren las images, cuando se borre un prodcut.
  )
  product: Product; //Un producto tiene muchas imagenes
}

//Ahora hagamos que aparezca   en el modulo de productos. para que se cree la tabla
//en la base de datos..
//Vamos a src/products/products.module.ts y lo importamos.
//Luego vamos a src/app.module.ts y lo importamos en TypeOrmModule.forFeature
