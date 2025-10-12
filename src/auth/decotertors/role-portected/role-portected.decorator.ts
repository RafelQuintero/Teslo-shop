//se comenta :@SetMetadata('roles', ['admin', 'super-user'])con la finalidad de  crear un decorador privato que porteja los roles  que es :

import { SetMetadata } from '@nestjs/common';
import { ValiRoles } from 'src/auth/interfaces';

// 👉 IMPORTANTE: creamos una  varible que se puedea utilzar el cualquier lado si exite un cambio el la mismma.
export const META_ROLES = 'roles';
//crearemos una intreface para los roles, y  que la podamos utilizar aqui

// 👉 IMPORTANTE: Para tener un mejor contro creamos un arrego de numeracion validRoles

export const RolePortected = (...args: ValiRoles[]) => {
  //esta es una funcion que recibe un arreglo de string  y ese arreglo de string lo establece en SetMetadata() que llamara "role.protected",
  //   a este parametro lo quiero que se llame "roles" pruq eso es lo que estamos esperando. y el argumentos  "arg " se los pasamos a setMetadata como segundo parametro

  return SetMetadata(META_ROLES, args);
};
