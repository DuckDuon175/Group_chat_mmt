import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GroupChatService } from "./groupChat.service";
import { groupChatRequest } from "./dto/groupChat.request";
import { ChatService } from "../chat/chat.service";

@WebSocketGateway({
  cors: {
    origin: "http://127.0.0.1:3002",
    method: ["GET", "POST"],
    allowHeaders: ["Content-Type"],
  },
})
export class GroupChatGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly groupChatService: GroupChatService,
    private chatService: ChatService
  ) {}
}
