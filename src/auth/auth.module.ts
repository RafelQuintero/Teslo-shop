import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule, //importamos el ConfigModule para manejar las variables de entorno
    TypeOrmModule.forFeature([User]), //Se agregó para hacer la  creacion de las tabla e la DB.
    PassportModule.register({ defaultStrategy: 'jwt' }), //importamos el PassportModule para la autenticacion

    JwtModule.registerAsync({
      //importamos el JwtModule para manejar los JWT
      imports: [ConfigModule], //importamos el ConfigModule para manejar las variables de entorno
      inject: [ConfigService], //inyectamos el ConfigService para manejar las variables de entorno
      useFactory: (configService: ConfigService) => {
        // console.log('JWT_SECRET:', configService.get('JWT_SECRET')); //probamos que nos traiga la variable de entorno

        // console.log('JWT_SECRET:', process.env.JWT_SECRET);
        if (!configService.get('JWT_SECRET'))
          //si no esta definida la variable de entorno
          throw new Error('JWT_SECRET is not defined'); //lanzamos un error

        return {
          secret: configService.get('JWT_SECRET'), //process.env.JWT_SECRET, //esto debe ser una variable de entorno
          signOptions: { expiresIn: '2h' }, //el token expira en 2 horas
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule], // P<aa que el User pueda uasrlo fuera de este módulo.
})
export class AuthModule {}

//paso para  de lo que hace este modulo
//Con el payload del JWT  se grabó un  correo electronico  o el id , con este JWT, se quiere seber que  usuario es en la base de datos y obterne
// toda la informacion de este usuario. (correo,id,rol,estado, etc ).
//realizamos esta consulta mediante una estrategia personlalizada expandiendo el JWT.
