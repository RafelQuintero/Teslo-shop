//crearemos un decorador persolaizao patra obtener el usuario
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  // esta GetUser es una funcion que recibe dos parametros , que devuelve un coallbck que no es mas que una funcion anonima.

  (data: string, ctx: ExecutionContext) => {
    //console.log({ ctx }); //el data es la informacion que le pasemos al decorador GetUser. como parametro
    // el ctx es el contexto de la ejecucion, que nos permite acceder a la request y response.
    //console.log({ data }); //el data es la informacion que le pasemos al decorador GetUser. como parametro
    //accedamaos a la request
    const req = ctx.switchToHttp().getRequest();
    // console.log({ req }); //en la request tenemos toda la informacion del usuario autenticado

    const user = req.user; //el user es la informacion del usuario autenticado que viene en la request

    //cHEQUEMOS QUE SI VIENE EL USUARIO EN LA QUE ESTA EN LA REQUEST
    if (!user)
      throw new InternalServerErrorException('Usr not found (request)'); // este error es por si no viene el usuario en la
    //   y es un error del backend

    return !data ? user : user[data]; //si viene el data, que es la informacion que le pasamos al decorador GetUser, devolvemos esa informacion del usuario
    //computada en la data, si no viene el data, devolvemos todo el usuario

    //return user; //Si todo lsale bien mando el user//se sutituyo  'Hola mundo , para hacer la prueba que funciona el decorador';
  },
);
