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

  @SubscribeMessage("createGroup")
  async handleCreateGroup(client: Socket, payload: groupChatRequest) {
    try {
      const newGroup = await this.groupChatService.saveGroupChat(payload);
      this.server.emit("createGroup", newGroup);
    } catch (e) {
      console.log(e);
      client.emit("error", { message: e });
    }
  }

  @SubscribeMessage("getGroup")
  async handleGetById(client: Socket, groupId: string) {
    try {
      const groupChat = await this.groupChatService.findGroupChatById(groupId);
      const chats = await this.chatService.getMessageByGroupId(groupId);
      this.server.emit("getByIdResponse", { groupChat, chats });
    } catch (e) {
      console.log(e);
      client.emit("error", { message: e });
    }
  }

  @SubscribeMessage("updateGroup")
  async handleUpdateGroup(
    client: Socket,
    groupId: string,
    payload: groupChatRequest
  ) {
    try {
      const updatedGroup = await this.groupChatService.updateGroupChat(
        payload,
        groupId
      );
      this.server.emit("updateGroup", updatedGroup);
    } catch (e) {
      console.log(e);
      client.emit("error", { message: e });
    }
  }

  @SubscribeMessage("deleteGroup")
  async handleDeleteGroup(client: Socket, groupId: string) {
    try {
      await this.groupChatService.deleteGroupChat(groupId);
      this.server.emit("deleteGroup", { groupId });
    } catch (e) {
      console.log(e);
      client.emit("error", { message: e });
    }
  }
}
