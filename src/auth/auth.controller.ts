import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

import { Auth, GetUser, RawHeaders } from './decotertors';
import { UserRoleGuard } from './guars/user-role.guard';
import { RolePortected } from './decotertors/role-portected/role-portected.decorator';
import { ValiRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  //!+++++++++++++++++++++
  //! 📝 NOTA: Crearemos un ge paara hacer un chequeo de como esta el status del usuario
  @Get('check-status') //El nombre final de la
  @Auth() //ruat protegida que lo necesita tener ulgun roles
  checkAutsStatus(
    //todo 📝 NOTA: Necesito el id del usuario; @GetUser('id') id :string o toda la informacion del usuario @GetUser('user') user :User
    @GetUser() user: User,
  ) {
    return this.authService.checkAutsStatus(user); //Se debe colocar el id o el user  logeado)
  }

  //!++++++++++++++++

  // 📝 NOTA: Creamos nuetra primera ruta  privada para validar el JWT de usuario y que este este activvo

  @Get('private')
  @UseGuards(AuthGuard()) //el AuthGuard viene por defecto con passport y valida el JWT
  testingPrivateRoute(
    //usemos el deocador @Req() para obtener la request
    @Req() request: Express.Request, //la req es la request que viene del cliente
    //Usamos el decorador GetUser para obtener el usuario autenticado
    @GetUser() user: User, //el user es la informacion del usuario que devuelve el decorador GetUser.
    // para mandar varios vparametros al decorador GetUser, solo tenemos que separarlos por coma preo que esten dentro de un arrglo.['email', 'role', 'fullName']
    @GetUser('email') userEmail: string, //asi obtenemos solo el email del
    @RawHeaders() rawHeaders: string[], //como no se le esta pasando algo de data al parametro de GetRawHeaders data: string[] nos devuelve undefned (array vacio)
  ) {
    //console.log({ request }); //esta es la request que viene del cliente
    console.log(request); // console.log({ user }); //esta es la informacion que devuelve el decorador GetUser

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user: user, //devolvemos la informacion del usuario  que lo contendra el decorador GetUser.
      userEmail, //devolvemos el email del usuario
      rawHeaders,
    };
  }

  //cramos otra ruta privada para verificarr que el usuariocumple con ciertos roles
  @Get('private2')
  //crearemos un decrador para decirle que privteRout2 necesita ciertos roles.. POr ahora utilzaremos un decorador personalizado llamado:

  //se comenta :@SetMetadata('roles', ['admin', 'super-user']), con la finalidad de  crear un decorador privato que porteja los roles este decorador es:
  @RolePortected(ValiRoles.superUser, ValiRoles.admin, ValiRoles.user) //si dejo vacio el parametro, cualquier usuario puede entrar sin ninguna restricccion.
  //al madarle un parametro o varios parametros indicandole que tipo de autorizcion tiene.

  // @SetMetadata('roles', ['admin', 'super-user'])    //este decorador es para setear metadatos a la ruta private2,
  //   en este caso le estamos diciendo que esta ruta necesita los roles admin y super-user.
  //  (esta es la informacion que se validad com valiRoles que está declarada en el archivo user-roels.guards.ts)
  //Para evaluar estos roles, necesitamos un guard que lo haga, lo crearemos en la carpeta auth/guards
  @UseGuards(AuthGuard(), UserRoleGuard) //el AuthGuard viene por defecto con passport y valida el JWT, . Usemos el UserRoleGuard que creamos
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola Mundo Private 2',
      user,
    };
  }

  //*+++++++++++++
  //crearemos un decorador basados en otros decoradores para utilizarlo en esta ruta, haciendo que esta sea prvada
  @Get('private3')
  //el ecorador de abajo se creo para sustituir los decoradores  @RolePortected(ValiRoles.superUser, ValiRoles.admin, ValiRoles.user)
  // y el decorador  @UseGuards(AuthGuard(), UserRoleGuard). eviatndo escribir pas codigo y poder equibocarse.
  @Auth() //nota: sie parametro de Auth()esta vacio el puede entrar a ruta , pero si contine ValidRoles.admin
  // y/o tambien VaildRoles.super-user  solo etrara si este usuario tiene este permiso
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola Mundo Private 3',
      user,
    };
  }

  //*++++++++++++
}
