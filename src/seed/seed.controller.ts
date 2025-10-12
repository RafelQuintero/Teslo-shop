import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decotertors';
import { ValiRoles } from '../auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValiRoles.admin) //Quiero ejecutar el seed pero el usuario debe ser  administrador de lo contrario no lo puede ahacer
  // al compliar  el proyecor  nest me da la adverticia de un error. motivado a que AuthGuard()
  //Debe de estar inculido  en la importacion de cada modulo donde se valla a ejecutar.
  executeSeed() {
    return this.seedService.runSeed();
  }
}
