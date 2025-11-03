import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService], //Lo unico que estaá usuando nuevo es el
  imports: [AuthModule],
})
export class MessagesWsModule {}
