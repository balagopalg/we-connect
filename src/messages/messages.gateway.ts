import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { MessageObject } from './interface/messages.interface';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('MessageGateway');
  @WebSocketServer() server: Namespace;
  private clients: Map<string, string> = new Map();

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Websocket Gateway client.`, client.id);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  @SubscribeMessage('newMessage')
  async handleMessage(
    @MessageBody() data: MessageObject,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const { content } = data;
      const messageData = JSON.parse(content.toString());
      const receiver = messageData.receiver;
      const message = messageData.message;

      if (receiver && message) {
        this.server
          .to(receiver)
          .emit('new message', { sender: client.id, message });
      } else {
        throw new Error('receiver or message not found');
      }
    } catch (err) {
      throw err;
    }
  }
}
