//todo: el dtome indica como voy a mandar la iformacio por medio de postman o el fronet
//todo: tambien tengo que especifacar  el tipo de informacion que se va recibir, y sus validaciones,
// todo por lo que se debe utilizar decoradores para que se ejecuten  los tipos y validaciones.

import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// todo para que me sirva como un Dto.
export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;
}
