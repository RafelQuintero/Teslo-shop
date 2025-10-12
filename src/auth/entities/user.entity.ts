// 👉 IMPORTANTE: Recurede que las identidades me indica como  va a lucir los objetos en mi tabla.
//Renombremosla  el archivo autch.entity.ts  como user.entity, ,tambien renombremos la clas de Autch por User

import { Product } from '../../products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' }) //Será el  nombre de la tabla
export class User {
  @PrimaryGeneratedColumn('uuid') //si se deja vacio el se incremetará automaticamente , pero no quero eso , por esose llena
  id: String; //Se crea un identificador único qu no cambie desde sus creación

  @Column('text', {
    unique: true,
  })
  email: string; //el correo  que sera otra columna

  @Column('text', {
    select: false, //con esto le decimos que por defecto no lo traiga  o lo muestre cuandodevuelva los datos del user.
  })
  password: string; // la clave que crea  en otra columna

  @Column('text', {})
  fullName: string; //el nombre del ususrio que esrá otar columna

  @Column('bool', {
    default: true,
  })
  isActive: boolean; // Otra columna. Con esta varible  lo que se hará que el usuaro estara activo o no peor  estará en la DB.

  @Column('text', {
    array: true,
    default: ['user'], //todos los usuarioque se crea van a tener el rol se usuario
  })
  roles: string[]; //Que tipo de autorizacion tiene el user, y roles  es un arreglo de string
  //Pra indicarle que el correo simepre se guarde en minuscula y sin espacios

  // 📝 NOTA: Relacion de productos con usuario.
  @OneToMany(
    //el primer argumento es la otra entidad; que en es en este caso el objeto product que se como luce la tabla.
    () => Product,
    //el segundo argumentos.Es un instancia de mi producto y se relcion  con la tabla "Product"
    // Se releciona co product.user donde user no exite en la tabla de "Porduct" . crearemos
    //para que se elimine el error.
    (product) => product.user,
  )
  //nombre del decorador le colocamos pordduct: de tipo Product
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim(); //.trim() elimina los espacios en blanco.
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
