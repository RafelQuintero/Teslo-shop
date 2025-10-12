//realizamos esta consulta mediante una estrategia personlalizada expandiendo el JWT.

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

//todas las estrategias en nestjs son servicios (providers) por lo que deben ser decoradas con @Injectable()
//el JwtStrategy debe ser utilizado en el modulo de auth (auth.module.ts) por lo que debe ser exportado en el array de providers

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 👉 IMPORTANTE:  debo de implemntra una forma de expandir la vadilacion de JWT

  //passportStrategy() me va decir si el JWT es valido o no, ya que este contiene la KEy_SECRET la fechade creacion y vencimiento,
  //  asi com tambien el tiempo de vencimiento.
  //Tambie puedo hacer en este momento si el usuario está activo o no lo esta en la base de datos.
  //por medio de una function async validate(payload:any){...}
  //implementemosla

  constructor(
    //hagamos la inyeccion del constructor con la idetidad que vamos a manipular
    //inyectemos el repositorio del usuario para hacer la consulta a la base de datos
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    //cheuqemos previaemnte si la varible secrte aexiste
    const secret = configService.get('JWT_SECRET');
    if (!secret)
      throw new Error(
        'FATAL ERROR: JWT_SECRET is not defined in enviroment   variables ',
      );

    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    //como es una clase extendidad se necesita llamar al constructor del padre (super()).

    //aqui van las opciones de la estrategia JWT
    // secretOrKey: configService.get('JWT_SECRET') //la clave secreta para validar el JWT (debe ser una variable de entorno)
  }

  // el validete recibe como parametro el payload (simepre que este actvio )del JWT
  //  por lo momento será de cualqueir tipo.((any) pero luego lo cambiaremos por una interface personalizada)
  // que regresará una promesa de un objeto usuario (user)  de la DB o cualquier otra cosa que yo quiera retornar.
  //Hagamos la implementacion de ese payload creando un nuevo archivo: jwt-payload.interface.ts  que esta el un folder llamdo interfaces
  async validate(payload: JwtPayload): Promise<User> {
    new UnauthorizedException();

    //Extraemos el correo electronico del payload
    const { id } = payload; //debemos sustituiur el email por el id del usuario en una app real

    //COnsultemos la base de datos para ver si el usuario existe y esta activo
    //  si existe retornamos el usuario, si no existe lanzamos una excepcion
    const user = await this.userRepository.findOneBy({ id }); //buscamos el usuario por su correo electronico en DB//sera susttituido por el id del usuario en una app real

    if (!user)
      throw new UnauthorizedException(
        'Token not valid - User does not exist in DB',
      );

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive - User is not active');

    const { password, ...userData } = user; //extraemos el password del usuario para no retornarlo

    //Mostremos en consola si el usrurio está activo on no lo está.
    //console.log({ userData });

    return user; //Lo que se retorne en el validate() se va a guardar en el request del usuario para ser utilizado en los controladores
    //  y se podra acceder a el en los controladores (req.user)
    //  y en los guards (req.user)
    //  y en los decorators (req.user)
  }
}
