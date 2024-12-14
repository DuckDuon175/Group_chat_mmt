import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  InternalServerErrorException,
} from "@nestjs/common";
import { MessageSchema } from "./schema/message.schema";
import { MessageRequest } from "./dto/message.request";
import { ApiResponse } from "@nestjs/swagger";
import { ChatGateway } from "./chat.gateway";
import { Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { MessageResponse } from "./dto/message.response";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatGateWay: ChatGateway,
    private userService: UserService
  ) {}

  @ApiResponse({
    status: 200,
    type: [MessageSchema],
    description: "Successful",
  })
  @Get("messages/:receiverId/:groupChatId")
  async loadMessages(
    @Param("receiverId") receiverId: string,
    @Param("groupChatId") groupChatId: string,
    @Req() req: Request
  ) {
    try {
      const authorizationHeader = (req.headers as any)["authorization"];

      const userId = authorizationHeader.split(" ")[1]; // Bỏ chữ "Bearer"
      if (!userId) {
        throw new Error("Invalid authorization header format");
      }
      console.log("User id:", userId);

      let messageRequest = {
        senderId: userId,
        receiverId: receiverId,
        groupChatId: groupChatId,
      } as MessageRequest;

      let messages = await this.chatGateWay.loadMessages(
        messageRequest,
        {} as Socket
      );
      console.log(messages);

      const messageResponses = [] as MessageResponse[];
      for (let msg of messages) {
        let msgSender = await this.userService.getUserById(msg.senderId);

        let messageResponse = {
          senderId: msg.senderId,
          senderName: msgSender.username,
          avatar: msgSender.username.charAt(0),
          receiverId: receiverId,
          message: msg.message,
          groupChatId: groupChatId,
          time: msg.time,
        } as MessageResponse;

        messageResponses.push(messageResponse);
      }
      return messageResponses;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error when loading message");
    }
  }

  // Gửi tin nhắn
  @ApiResponse({
    status: 200,
    type: [MessageSchema],
    description: "Successful",
  })
  @Post("send")
  async sendMessage(
    @Body() messageRequest: MessageRequest,
    @Req() req: Request
  ) {
    try {
      const authorizationHeader = (req.headers as any)["authorization"];

      const userId = authorizationHeader.split(" ")[1]; // Bỏ chữ "Bearer"
      if (!userId) {
        throw new Error("Invalid authorization header format");
      }
      console.log("User id:", userId);
      messageRequest.senderId = userId;
      return this.chatGateWay.handleMessage(messageRequest, {} as Socket);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error when sending message");
    }
  }
}
