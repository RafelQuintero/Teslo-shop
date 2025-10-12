import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValiRoles } from '../interfaces/valid-roles';
import { RolePortected } from './role-portected/role-portected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guars/user-role.guard';

export function Auth(...roles: ValiRoles[]) {
  //1.- MMandel los roels que tiene "..roles:: que setra o que declacreamos como un num en las interface."
  //2.-Debo regresar el resultado de dicha funcion potr medio de  los parametros que contenga applyDecorators que son decradores pero no se les cloca el @.

  return applyDecorators(
    RolePortected(...roles), // Nota: debe ser colocado sin el "@", y sedebe sloicitar el arreglo de los roles(...roles)

    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
