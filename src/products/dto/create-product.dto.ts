//todo: Cofiguarcion del DTO ( para poder hacer una peticon POST)
//todo: Esta es la la clase que crear con todos la porpeides y valoress que debe  lucir
// todo, el dot para que el body
//todo: luzca exactamente igual. en la parte de insercion.

import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

//todo; Nota: debemos de instalar en el proyecto la libreria de class-alidator y class-transforme
//todo, para hacela validacion y transformaciones, para que el body luzca  excatemante como el DTO.
//todo; Y el main.ts debebo pegar la configuracion global de los pipies
//todo;  para hacer las validacion y transforaciones de manera global.
//todo

export class CreateProductDto {
  //todo tomemos los datos del entity
  //Necesitamo:
  // Decoremos las propiedades del dto para las validacions
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional() //* Se incluye ya que en la propiedad se decaro opcional.
  price?: number; //el precio puede ser opcional "?"

  @IsString()
  @IsOptional()
  decription?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true }) //* con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  sizes: string[]; //es obligatorio el sizes y es un arrego del tipo string

  @IsIn(['men', 'women', 'kid', 'unisex']) // Dentro de ese arrglo se obliga aque se uno de esto string
  gender: string;
  //Ce crearon el dto para las tags
  @IsString({ each: true }) // con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  @IsOptional()
  tags?: string[]; //es opcional y es un arreglo del tipo string

  //creo el dto para las imagenes
  @IsString({ each: true }) // con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  @IsOptional()
  images?: string[]; //es opcional(Puede que los envie o nolov envie) y es un arreglo del tipo string
}
//! Este dto lo uitlizaremos para insertar en la base de datos.
