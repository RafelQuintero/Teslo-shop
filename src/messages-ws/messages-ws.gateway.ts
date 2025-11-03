import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

//Para eliminar los errorer que estan el la linea 1 me pide instalar dos paquetes: @nestjs/websockets @nestjs/platform-socket.io
//y ocupar ciertos tipos de datos que viene se socket.io

//Esta implementacion de webSockeGateway el el controlado que recibe la peticones del cilente y se las manda
//al servido para recibir un respuesta

@WebSocketGateway({ cors: true }) //le agreagomo  como parametros a cors en true para que la comunicacion sea eun servidores difeentes
//con eesto ya tenemos toda la implementacion hecha para hacer la comunicacion
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  //debemos implementar dos tipos de conecciones se conecya y no se conecta
  // no ubiamos  el cursor donde dice MessagesWsGateway  y le doy a la tecla crtl + . y localcizo el que diga
  //omplement all unimplemented interface , le doy enter y ellea la escribe automáticamente.

  //Para  decir a todos que una persona se conectó en el chat debo tener la instancia y para eso utilizo el decorado:

  @WebSocketServer() wss: Server; //le coloco el nombre al websocketserver :wss y es del tipo Server y debe ser importado de socket.io,
  //por lo que wss tiene  toda la informacion de los cientes conctados.
  constructor(
    private readonly messagesWsService: MessagesWsService,

    //hago la inyeccion del JwtService para validar el token

    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    //Mostrems en consolo la coneccion del
    // console.log(client);

    //Mostremos el authentication que viene en el header que es el token
    //sera de la siguiente manera:
    const token = client.handshake.headers.authentication as string;
    // console.log({ token }); // muestro el token que viene en el

    //*previamente obtengamos el payload del token
    //* Recurede importar el JwtService de @nestjs/jwt
    //* hagamos un try y un catch para validar el token
    let payload: JwtPayload; //definimos una variable payload del tipo JwtService que puede dser modificada.

    try {
      payload = this.jwtService.verify(token); //verificamos el token y obtenemos el payload
      //? 📝 NOTA:  es coloca este código aqui por si sale un error me lo envia al catch par que este cliente sea desconectado.
      await this.messagesWsService.registerClint(client, payload.id); //?nota:sale este error porque el metodo registerClint
      //  debe recibir dos parametros y solo tiene uno. por lo que debo modificar el servicio.
      //  colocacndo userId como segundo parametro.
    } catch (error) {
      //si existe un error significa que el cliente no lo dejamos pasar
      //desconectemos al cliente
      console.log('Cliente no autenticado');
      client.disconnect();
      return;
    }

    //si llegamos aqui es porque el cliente esta autenticado, lo cometamos poruqe ya se verificó.
    //console.log({ payload }); //muestro el payload del client que viene del token

    //se debe instalar el paquete de socet.io para utiizar  el cliente como un socket
    //comento los console.log proue ya se que funcina
    // console.log('Cuestomer connected', client.id); //cliente conectado

    //Hagamao referencia  para notificarle a todo los del chat que  un client se conectados por el id inclusive
    //el mismo cliente que se conectó.

    this.wss.emit(
      'clients-updated', //este es el evento que se va a emitir
      this.messagesWsService.getConnectedClients(), //este es el segundo parámetro que se va a enviar con el evento
    );

    //colocquemos el número de clientes para saber cuantas personas estan connectadas.

    // console.log({
    //   Clientes_conectados: this.messagesWsService.getConnectedClients(),
    // });

    //notifiquemos con ese wss el el chat  a todos que un cliente se conectó.
    // que se va emitir hacia el chat y como segundo paramétro un  ,o um arreglo  pero en este caso utilizare el id del client.
  }
  handleDisconnect(client: Socket) {
    //comento los console.log proue ya se que funcina
    // console.log('Customer disconnected', client.id); //clente desconectado
    //Hagamos refernecia cuando un cliente se desconecta
    this.messagesWsService.removeClient(client.id);

    // console.log({
    //   Clientes_conectados: this.messagesWsService.getConnectedClients(),
    // });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //Pongamos a escuchar al servidor  los mensajes que vienen del cliente
  //con un metodo @SubscribeMessage('message-from-client')
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //chequemos con un console.log  lo que viene del cliente. vere por consola el id del cliente y el message
    // console.log({ clientId: client.id, payload }); //me muestra el id del cliente y el mensaje que envia

    //casos de uso: messge- from-server
    //1. caso de uso: messge- from-server
    //?  el servidor emite el mensaje  solo con la persona que envio el  mensaje(cliente).
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: `Tu mensaje fue: ${payload.message}` || 'no-message!!',
    // });

    //2.caso de uso: messge- from-server
    //? el servidor emite el mensaje a todos los clientes conectados menos al que envio el mensaje(cliente)
    //? utilicemos  client.broadcast.emit para emitir a todos menos al que envio el mensaje.

    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: `Tu mensaje fue: ${payload.message}` || 'no-message!!',
    // });

    //3.caso de uso: messge- from-server
    //? el servidor emite el mensaje a todos los clientes conectados incluido al que envio el mensaje(cliente)
    //? utilicemos  this.wss.emit para emitir a todos incluido al que envio el mensaje.
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id), ///aqui colocquemos el nombre del usuario
      //  que envio el mensaje identificado con el id del socket
      message: `Tu mensaje fue: ${payload.message}` || 'no-message!!',
    });

    //cosos de uso: messge- from-server
    //supngamos   que el cliente es una sala de ventas
    //client,join('sala-12345')  para unir al cliente a esta  sala.
    //ahora lo que  quiero; es  que un cliente envie un mensaje a esa sala en particular
    // envinado el menssge de la siquinte manera:
    // this.wss.to('sala-12345').emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: `Tu mensaje fue: ${payload.message}` || 'no-message!!',
    // });
  }
  //para evitar el error debo crear el tipo NewMessageDto que viene en el payload .
}
