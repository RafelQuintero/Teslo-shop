// import { PartialType } from '@nestjs/mapped-types'; //se comento para que PartialType se importara de swagger
//para poder documentarlo en  la web de Swagger.
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
