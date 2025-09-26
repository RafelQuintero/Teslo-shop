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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) //hacemos la inyeccion del modelo que es User
    private readonly userRspository: Repository<User>, //el tipo de datos que manejará es el <User> que en nuetra Entity
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

      return userWithoutPassword; // Estamos retornando todos los datos del usuario excepto el password.
      //TODO: Retornar en JWT de acceso del usurio
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
      select: { email: true, password: true }, //necesito que me seleccione el email y el el password  ya que ete
      // por defecto no lo trae ya que es una columna que tiene el select  en false en su entity.
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!bcrypt.compareSync(password, user.password))
      //comparamos el password que viene del body con el que esta en la base de datos
      throw new BadRequestException('Credentials are not valid (password)');

    return user;
    //TODO: Retornar el JWT de acceso del usurio.
  }

  private handleDBError(error: any): never {
    // never me indica que nunca va devolver algo
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}

//Isntalemos un paquete para hacer las encriptacion de nuetra contraseña para que no queden visible.
//yarn add bcrypt, adcionalmente debemos instalar el tipado: yarn add -D @types/bcrypt , solo como depenedencia de dearrollo.
//Paara utilizar el JWT en nestjs: yarn add @nestjs/jwt passport-jwt
//yarn add -D @types/passport-jwt
//luego de instalarlo debemos importarlo en auth.module.ts y en el servicio auth.service.ts
