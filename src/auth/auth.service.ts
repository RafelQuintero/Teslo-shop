import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'; //hacemo un importacion de todo lo que contiene bcrypt
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) //hacemos la inyeccion del modelo que es User
    private readonly userRspository: Repository<User>, //el tipo de datos que manejará es el <User> que en nuetra Entity

    //inyectamos el servicio de JWT que nos permite generar los token (debe ser importado en el modulo)
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto; //obtengo el password  y el resot lo tomo de ..userData que viene del body

      const user = this.userRspository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), //el d  será encriptado con 10 vuelta que procesó hashSync
      });
      await this.userRspository.save(user);

      // delete user.password ,para evira este error.

      const { password: _, ...userWithoutPassword } = user; //con esto evitamos el delete

      return {
        ...userWithoutPassword,
        //TODO: Retornar en JWT de acceso del usurio
        token: this.getJwtToken({ id: user.id.toString() }), //generamos el JWT del usuario// eleiminado el email por el id y le indicamos que es string
      }; // Estamos retornando todos los datos del usuario excepto el password.
    } catch (error) {
      this.handleDBError(error);
      console.log(error);
    }

    // return 'This action adds a new auth';
  }

  //Creamos un metod llamado login para el inicio de sesion
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto; //destructuramos el email y password que viene del body
    const user = await this.userRspository.findOne({
      where: { email }, //buscamos el email en la base de datos
      select: { email: true, password: true, id: true }, //necesito que me seleccione el email y el el password  ya que ete
      // por defecto no lo trae ya que es una columna que tiene el select  en false en su entity.
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)'); //me indica que no eixte un usario con ese correo.
    }
    //Chequemo que existe un usuario con ese correo
    if (!bcrypt.compareSync(password, user.password))
      //comparamos el password que viene del body con el que esta en la base de datos
      throw new BadRequestException('Credentials are not valid (password)');

    const { fullName, isActive, roles, ...userData } = user; // estamso extrayendo los datos que no quiero mostrar del usuario. que son:fullName, isActive, roles

    //Mostremos los datos del usuaro por conslola
    // console.log({ userData }); //no l necitamos mostrarlo en consola ya que ya lo probamos que se meustra el id

    return {
      userData,
      //...user, //exparcimos los datos del usuario.
      //TODO: Retornar el JWT de acceso del usurio.
      token: this.getJwtToken({ id: user.id.toString() }), //generamos el JWT del usuario// eleiminado el email por el id y le indicamos que es string
    };
  }

  //todo: crearé eñ checkAutsStatus()
  async checkAutsStatus(user: User) {
    //ya se que el token de este usuario es valido

    console.log(user);

    return {
      user,
      //TODO: Retornar el JWT de acceso del usurio.
      token: this.getJwtToken({ id: user.id.toString() }), //generamos el JWT del usuario// eleiminado el email por el id y le indicamos que es string
    };
  }

  //todo++++++++
  //* 📝 NOTA: Crearemos un método idepediente para hacer el JWT

  private getJwtToken(payload: JwtPayload) {
    //Generemos el sevico q, ue ya está proveido por mi  inyectemoslo en el constructor
    //utilicemos
    const token = this.jwtService.sign(payload); //el metodo sign recibe el payload que es la informacion que queremos guardar en el JWT

    return token;
  }

  //************ */
  private handleDBError(error: any): never {
    //  el tipo de datos es nevere ste  me indica que nunca va devolver algo
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}

//Instalemos un paquete para hacer las encriptacion de nuetra contraseña para que no queden visible.
//yarn add bcrypt, adcionalmente debemos instalar el tipado: yarn add -D @types/bcrypt , solo como depenedencia de dearrollo.
//Paara utilizar el JWT en nestjs: yarn add @nestjs/jwt passport-jwt
//yarn add -D @types/passport-jwt
//luego de instalarlo debemos importarlo en auth.module.ts y en el servicio auth.service.ts

//* 📝 NOTA: : El jwt debo utilizarlo: 1.-cuando el esuario se crea, debe tener un jwt
//* 📝 NOTA:                           2.-Cunado hago el login debo regresar el Jwt del Usuario.
//* 📝 NOTA:                           3.-Cada vez que el usuario tenga que generar un noevo JWT para su renovacion.
