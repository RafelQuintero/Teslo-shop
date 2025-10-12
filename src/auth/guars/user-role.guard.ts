import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decotertors/role-portected/role-portected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //Para que este guard funcione, tiene que implementar CanActivete
  //Debe regresar un booleano o un promise de booleano o un observable de booleano
  //El context es el contexto de la ejecucion, que nos permite acceder a la request y response.
  //
  // Para ver usuario debel obtener la meta datsa de la ruta, es decir que rol esta cumpliendo el usuario.
  //y para hezo debemos crear el constructor y dentro de el, inyectar el Reflector de nestjs/core
  //Refelctor me sirve para obtener los metadatos de la ruta.
  //  decir Obtener informacion del los decoradores que se han colocado en la ruta. y de la metadatos que se han colocado en la ruta.

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //colocquemsos un clonsole.log par ver que se etaea ejecutando clase UserRoeleGuard
    // console.log('UserRoleGuard'); //
    const valiRoles: string[] = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    ); //|| []; //con getHandler obtenemos el manejador de la ruta, es decir la funcion que se esta ejecutando en la ruta.

    //console.log({ valiRoles }); //esto es para ver que viene uno de los roles, es decir no es undefine
    //*+++++++++++++++}

    // si no exiten  el valiRoles(no se creo ), cualquier ususaio puede entrar.
    // Esto ocurre cuando en el cotormador se me olvido colcocar el: @SetMetadata('roles', ['admin', 'super-user'])
    if (!valiRoles) return true;

    //Pero si  valiroles existe, pero es un objeto vacio ;es decir no  tiene roles asignados,cualquier usurio puede entrar.
    if (valiRoles.length === 0) return true;

    //**++++++++++++ */

    //Validemos los roles, viendo que roles tiene un usario de los que estoy definiendo en  valiRole
    // Ontengaom los roles que tiene un ususrio
    const req = context.switchToHttp().getRequest();
    // console.log({ req }); //en la request tenemos toda la informacion del usuario autenticado

    const user = req.user as User; //el user es la informacion del usuario autenticado que viene en la request

    //Hagamos la validacion del usuario  para saber si el user existo , o no existe
    //Es decir que  en el conroloador se quiere utilizar UserRolGuard com poarametro de UseGuards y
    //  no uiliza AuthGuard() ( Que es el que establece el usuario en los geders) como parametro en UseGuards,
    // producira un error que lo detectará la consdion del if  de la limea de abajo

    if (!user) throw new BadRequestException('User not faund');

    // console.log({ userRoles: user.roles }); //se define como un arreglo ya que un usuario pude tener diferentes roles. //Comenteosla

    //hagamos una iteracion con un for of que es un cilco de javascripts para saber cuantos role tien el eusuario
    for (const role of user.roles) {
      if (valiRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      ` User ${user.fullName} need a valid role: [${valiRoles}]`,
    );

    //return true;
  }
}
