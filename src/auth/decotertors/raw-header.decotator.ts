//crearemos un decorador persolaizao patra obtener el raewheaders

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log({ data }); //el data es la informacion que le pasemos al decorador GetRawHeaders. como parametro, si no s le pasa viene undefned
    // el ctx es el contexto de la ejecucion, que nos permite acceder a la request y response.
    //console.log({ ctx }); //el data es la informacion que le pasemos al decorador GetRawHeaders. como parametro
    //accedamaos a la request.
    const req = ctx.switchToHttp().getRequest();

    return {
      rawHeaders: req.rawHeaders,
      data: req.data,
    }; //devolvemos los rawHeaders que vienen en la request

    // return 'Hola mundo , para hacer la prueba que funciona el GetRawHeaders decorador';
  },
);
