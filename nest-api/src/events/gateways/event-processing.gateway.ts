import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/events/data', cors: { origin: '*' } })
export class EventProcessingGateway implements OnGatewayInit {
  private readonly logger = new Logger(EventProcessingGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('DataGateway initialized');
  }


  emitEvent(payload: any) {
    this.logger.log('📤 Emitindo eventos para todos os adms:', JSON.stringify(payload, null, 2));
    this.server.emit('events', payload);
    this.logger.log('✅ Eventos emitidos com sucesso');
  }

  @SubscribeMessage('request_event')
  handleRequestEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('📥 Mensagem recebida do cliente:', data);

    client.emit('event_response', {
      message: 'Evento enviado com sucesso!',
      originalRequest: data,
    });
  }
}