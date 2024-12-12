import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageRequest } from './dto/message.request';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:3002', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private userService: UserService
  ) {}

  // Người dùng tham gia phòng chat (có thể là chat nhóm)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, client: Socket) {
    client.join(room); // Người dùng tham gia vào phòng chat
    this.server.to(room).emit('message', `${client.id} đã tham gia phòng ${room}`);
  }

  // // Gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() messageRequest: MessageRequest, client: Socket) {
    this.server.emit('receivedMessage', messageRequest);
    await this.chatService.saveMessage(messageRequest);
  }

  // Lấy tin nhắn giữa hai người dùng (chat cá nhân) hoặc nhóm
  @SubscribeMessage('getMessages')
  async loadMessages(@MessageBody() messageRequest: MessageRequest, client: Socket) {
    let messages = await this.chatService.loadMessages(messageRequest);
    // console.log("gatewway" , messages)
    return messages;
  }
} 
