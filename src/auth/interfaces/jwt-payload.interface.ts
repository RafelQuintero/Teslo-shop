//Hagamos la implementacion de ese payload creando un nuevo archivo: jwt-payload.interface.ts  que esta el un folder llamdo interfaces

//Qiero que luzca el payload de esta forma:
export interface JwtPayload {
  //email: string; //correo electronico del usuario este sera cambiado por el id del usuario en una app real
  id: string; //sub es el id del usuario en la app real

  //  id: string; //id del usuario n se incluyo el id por que en este caso no lo necesito.
  //Tampoco se incluyo las fecha de creacion y vencimiento del token, ya que estas las maneja el JWT
  // iat: number; //fecha de creacion del token
  // exp: number; //fecha de vencimiento del token
}
