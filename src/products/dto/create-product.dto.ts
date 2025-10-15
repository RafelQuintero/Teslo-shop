//todo: Cofiguarcion del DTO ( para poder hacer una peticon POST)
//todo: Esta es la la clase que crear con todos la porpeides y valoress que debe  lucir
// todo, el dot para que el body
//todo: luzca exactamente igual. en la parte de insercion.

import { ApiProperty } from '@nestjs/swagger';
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
  //Necesitamos la descripcion del dto del porducto
  @ApiProperty({
    description: 'Product title and is unique',
    nullable: false, //porque no puede venir sin  la descirociom
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 0.0,
    description: 'Product price',
    default: 0.0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional() //* Se incluye ya que en la propiedad se decaro opcional.
  price?: number; //el precio puede ser opcional "?"

  @ApiProperty({
    example: 'Cotton shirt',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  decription?: string;

  @ApiProperty({
    example: 'women_short_sleev_shirt',
    description:
      'to uniquely identify a product within a URL, usually without spaces, diacritics, or special characters',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 0,
    description: 'Available quantity of the product',
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'X', 'XX'],
    description: 'Product clothing sizes ',
  })
  @IsString({ each: true }) //* con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  sizes: string[]; //es obligatorio el sizes y es un arrego del tipo string

  @ApiProperty({
    example: 'unisex',
    description: 'Who is the product for?',
  })
  @IsIn(['men', 'women', 'kid', 'unisex']) // Dentro de ese arrglo se obliga aque se uno de esto string
  gender: string;

  //Ce crearon el dto para las tags

  @ApiProperty({
    example: 'shirt Nike-Fit men ',
    description: 'Tag the producto for characteritic of a product',
  })
  @IsString({ each: true }) // con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  @IsOptional()
  tags?: string[]; //es opcional y es un arreglo del tipo string

  //creo el dto para las imagenes

  @ApiProperty({
    example: 'photo',
    description: 'Product image',
  })
  @IsString({ each: true }) // con {each:true} estoy obligando que cada valor de ese arreglo debe ser un string
  @IsArray()
  @IsOptional()
  images?: string[]; //es opcional(Puede que los envie o nolov envie) y es un arreglo del tipo string
}
//! Este dto lo uitlizaremos para insertar en la base de datos.
