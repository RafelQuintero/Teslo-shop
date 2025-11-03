import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//creamos la interface
interface ConnectedClients {
  //quiero manejar el client conectado por el id , pero como voy a manejar
  // varios clientes debe ser un arrglo de un array  y este array es del tipo Socket (cliente)

  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable() //es exactamente igual a cualquier servico y tiene el decorador @Injectable()
//  apra poderlo inyecarlo como cualquier otr servicio
export class MessagesWsService {
  //Crearemos un lugar donde almacenaremos toso mis socket (clientes) para poder identificarlos

  //creamos una propiedad privada porque no se va a exponer afuera, que sera un objeto
  //vacio por los momentos. y tendra como tipo de dato para saber como luce esta propiedad  crenado una interface

  private connectedClients: ConnectedClients = {};

  //hagamos la inyecciona del servicio en el constructor para podder maejar el usuario conectado
  constructor(
    //?
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Método para cuando un cliente se conecta

  async registerClint(client: Socket, userId: string) {
    //? Verifiquepoa el usuario
    const user = await this.userRepository.findOneBy({ id: userId });

    //?Chequemos si el usuario no existe
    if (!user) throw new Error('User not found');
    //?que el usurio no este acitvo
    if (!user.isActive) throw new Error('User not active');
    //?Si el usuario existe y está activo

    //TODO: falata por eveluar que un mismo usuario no se conecte varias veces
    this.checkUserConnection(user);
    //todo:+++++++++++++++

    //al Conectarse un clientee  debo obtener su id
    this.connectedClients[client.id] = {
      //debe tenr las propiedades definidas en la interface ConnectedClients.
      socket: client,
      user: user,
    };
  }

  // Metdo para cuando un cliente se desconecta

  removeClient(clientId: string) {
    //Nota com parametro Puedo pesdir el client:Socket ó el el ide del cliente
    //Al desconectase un client invoco la dlete y haro refencia connectdCliets y le pso como argumento
    //el id del cleinte "clientId"
    delete this.connectedClients[clientId];
  }
  //esto es todo para mantener registardo al cliente conectado y el que se deconecta.

  //hagamos un metodo para que se haga el conteo de los clientes desconecatdos.

  getConnectedClients(): string[] {
    //hahamos una impresion de consloa para saber cuantos clientes estan conectados
    // console.log(this.connectedClients);

    return Object.keys(this.connectedClients); //como se pide que sea un número debe ser .lneght
    // ;ahora lo modificareno el length por los id  de clientes conctados. elilnando number por un string[]
  }

  //?Nuevo método para identificar un usuario por su id de usuario
  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  //? Creo  método para cuando este registrando un nueo cliente
  // //? debo verificar que el usuario ya está conectado
  // //? para evitar que el mismo usuario se conecte varias veces

  private checkUserConnection(user: User) {
    //se evaluara por el usuario connectado
    for (const clientId of Object.keys(this.connectedClients)) {
      const connetedClient = this.connectedClients[clientId];
      // console.log({connetedClient}); tengo el user y el socket connectado.
      //ahora evaluo si el usuario ya esta connectado
      if (connetedClient.user.id === user.id) {
        connetedClient.socket.disconnect(); //desconecto el socket
        break; //rompo el ciclo porque ya no voy a tener un usuario con ese id.
      }
    }
  }
}
