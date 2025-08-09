import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() payload: { room: string }, @ConnectedSocket() client: Socket) {
    client.join(payload.room);
    client.emit('joined', { room: payload.room });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() payload: { room: string }, @ConnectedSocket() client: Socket) {
    client.leave(payload.room);
    client.emit('left', { room: payload.room });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: CreateMessageDto) {
    const saved = await this.chatService.create(payload);

    this.server.to(payload.room).emit('message', {
      _id: saved._id,
      username: saved.username,
      content: saved.content,
      room: saved.room,
      createdAt: saved.createdAt,
    });
  }
}
