import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  // ✅ TODO: Hagamos la inteccion de productService en el constructor
  constructor(
    private readonly productsService: ProductsService,
    //? inyectemos el repositorio del usuario para hacerlo normalmente como lo hariamos en nuestro servico

    @InjectRepository(User)
    private readonly userReposoty: Repository<User>,
  ) {}

  // ✅ TODO:  creamos el método runnSeed()
  async runSeed() {
    //? Antes de insertar los nuevo productos llamemos:
    await this.deleteTables();

    //? antes de insertar productos insertemos usuarios. vamos a al archivo sees.data.ts
    //? listo insertemos los usuarios
    const adminUser = await this.inserUser();

    //ahora le mandamps lal prucot que usrario lo creo

    await this.insertNewroducts(adminUser); //? 👉 IMPORTANTE: llamamos a este metodo para que impacte
    //?👉 IMPORTANTE: en DB y borre todo
    return 'SEED EXECUTED';
  }
  //? Procedimeinto para purgar toda la base de datos, se debe borrar en cierto orden para no vilor la releción entre las tablas
  //?   crearemos un método privado para hacer este proceso ya que no se utilzará en orto lugar.

  private async deleteTables() {
    //?1ero Borraren¿mos los productos porque mantienen la integridad refencial com el usuario.
    //?porque si ya no hay productos ya podre elimimnar el usuario

    await this.productsService.deleteAllProducts();

    //? Despue de haecer la inyección en el constructor del para manipular el Usuario , podemos hacela la elimincion
    const queryBuilder = this.userReposoty.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  //?Porcedimeito para inserta un monton de usuarios

  private async inserUser() {
    //tomamo los usarios

    const seerUsers = initialData.users;

    //Hagoos un insert de lineas tomemos esta idea
    const users: User[] = []; //creamos  una variable user del tipo user que es un arreglo y que sea un arregl vacio
    seerUsers.forEach((user) => {
      users.push(this.userReposoty.create(user));
    });
    //Ahora procedemos a guardrlo
    const dbUsers = await this.userReposoty.save(seerUsers);
    return dbUsers[0];
  }

  //* 👉 IMPORTANTE: creamo una funcion private para que sola la pueda utilzar esta clase
  //*👉 IMPORTANTE: para   que cuando se llame borre tosa la data en DB

  private async insertNewroducts(user: User) {
    await this.productsService.deleteAllProducts(); // ✅ TODO: :se borratoda infoencion en DB
    //? 👉 IMPORTANTE: insertemeos toda la data en la DB para cargar el SEED.
    //? 👉 IMPORTANTE: : Utilzaremos el mismo método del  create que se untilizo en products.service.ts
    //? 👉 IMPORTANTE:  llamemoslos.
    const products = initialData.products;
    //const insertPromises = []; //* 👉 IMPORTANTE:  Creo un arreglo vacio, pero ocurre un error
    //* 👉 IMPORTANTE:  ya que typeScripts dice que nmca reciibiar un valor

    // ✅ TODO:  const insertPromises: Promise<any>[] = [] . Este códigoes muy bunerable,corrijamoslo.

    // ✅ TODO: Vamos a inferir el tipo de retorno de craete corrigiendo que el type de datos
    // ✅ TODO:  no sea any y asegurarno que nos devuelve una promesa

    const insertPromises: Promise<
      Awaited<ReturnType<typeof this.productsService.create>>
    >[] = [];
    // 👉 IMPORTANTE: Awaited== Extrae el tipo dntro de la promesa (products)
    // 👉 IMPORTANTE: ReturnType<typeof this.productsService.create__ Obtiene el tipo de retorno
    // 👉 IMPORTANTE: Promise<products>== obtengo la promesa bien tipado.

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises); // ✅ TODO: Espera que termine todas las inserciones

    return true; // ✅ TODO: Se  hicieron las inserciones correctamente
  }
}
