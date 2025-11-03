import { IsString, MinLength } from 'class-validator';

export class NewMessageDto {
  //debo crear las propiedades que va a tener el dto
  @IsString()
  @MinLength(1)
  message: string; //mensaje de tipo string
  //   @IsString()
  //   @MinLength(1)
  //   fullName: string; //nombre completo de tipo string
}
