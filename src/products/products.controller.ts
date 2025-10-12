import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decotertors';
import { User } from '../auth/entities/user.entity';
import { ValiRoles } from '../auth/interfaces';

@Controller('products')
//Si se quiere que un ususrio utilice cualquier de estas rutas,este debe esta autorizado con el decorado:que se creo. en este lugar
//pero no quiero que esto sea así. por lo que el decorador @Autch() lo cometaré, pero solo lo cocare donde lo necesito y que tipo de autorizacion.
// @Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth() //quitemos ValiRoles.admin para que sea auorizado cualquier usuario
  //Nececito especificar aqui el usuario que creo el porducto, por los momnetos cualquier user. Lo hago con un decoardorque ya tengo llamado @GetaUser()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User, //será un user: del tipo User
  ) {
    return this.productsService.create(createProductDto, user);
  }
  //TODO: se creara un un nuevo dot mediante un modulo, para que siempre valla agurpadosen estos
  // todo: para crear la paginacion de los productos para ejecuatr el get por paginas,
  //recuerde que la importcpn del Query viene de nestjs/common
  @Get()
  //Aqui no necesita estar autorizado, cualquierra puede ver el producto.
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto); // para ver lo en consola.

    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  //Aqui no necesita estar autorizado, cualquierra pued ever el procto
  findOne(@Param('term') term: string) {
    //todo: Cambiamos el metodo que se llama en el servicio
    //Para que utilice el metodo que aplane el resultado, es decir muestro lo que necesito.

    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValiRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User, //debo agregar el user para que tenga el eusrio que actulizó el product.
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValiRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
