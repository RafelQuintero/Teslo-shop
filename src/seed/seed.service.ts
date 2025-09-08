import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  // ✅ TODO: Hagamos la inteccion de productService en el constructor
  constructor(private readonly productsService: ProductsService) {}

  // ✅ TODO:  creamos el método runnSeed()
  async runSeed() {
    await this.insertNewroducts(); //? 👉 IMPORTANTE: llamamos a este metodo para que impacte
    //?👉 IMPORTANTE: en DB y borre todo
    return 'SEED EXECUTED';
  }
  //* 👉 IMPORTANTE: creamo una funcion private para que sola la pueda utilzar esta clase
  //*👉 IMPORTANTE: para   que cuando se llame borre tosa la data en DB

  private async insertNewroducts() {
    await this.productsService.deleteAllProducts(); // ✅ TODO: :se borratoda infoencion en DB
    //? 👉 IMPORTANTE: insertemeos toda la data en la DB para cargar el SEED.
    //? 👉 IMPORTANTE: : Utilzaremos el mismo método del  create que se untilizo en products.service.ts
    //? 👉 IMPORTANTE:  llamemoslos.
    const products = initialData.products;
    // const insertPromises = []; //* 👉 IMPORTANTE:  Creo un arreglo vacio, pero ocurre un error
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
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises); // ✅ TODO: Espera que termine todas las inserciones

    return true; // ✅ TODO: Se  hicieron las inserciones correctamente
  }
}
