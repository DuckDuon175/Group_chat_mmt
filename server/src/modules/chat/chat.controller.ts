import { Controller, Post, Body, Get, Param, Req, InternalServerErrorException } from '@nestjs/common';
import { MessageSchema } from './schema/message.schema';
import { MessageRequest } from './dto/message.request';
import { ApiResponse } from '@nestjs/swagger';
import { ChatGateway } from './chat.gateway';
import { Socket } from 'socket.io';
import { UserGuardModel } from '../authentication/dto/user.guard.model';
import { UserService } from '../user/user.service';
import { MessageResponse } from './dto/message.response';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatGateWay: ChatGateway,
    private userService: UserService
  ) { }

  // Lấy tin nhắn
  @ApiResponse({
    status: 200,
    type: [MessageSchema],
    description: "Successful",
  }) 
  @Get('messages/:receiverId/:groupChatId')
  async loadMessages(
    @Param('receiverId') receiverId: string,
    @Param('groupChatId') groupChatId: string,
    @Req() req: Request & { user?: UserGuardModel },
  ) {
    try {
      let sender = await this.userService.getUserByAccountId(req.user.accountId);

      let messageRequest = {
        senderId: sender.id,
        receiverId: receiverId,
        groupChatId: groupChatId
      } as MessageRequest;

      let messages = await this.chatGateWay.loadMessages(messageRequest, {} as Socket);
      console.log(messages)
    
      const messageResponses = [] as MessageResponse[];
      for(let msg of messages) {
        let msgSender = await this.userService.getUserById(msg.senderId);

        let messageResponse = {
          senderId: msg.senderId,
          senderName: msgSender.username,
          receiverId: receiverId,
          message: msg.message,
          groupChatId: groupChatId,
          time: msg.time,
        } as MessageResponse;

        messageResponses.push(messageResponse);
        
      }
      return messageResponses;
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "Error when loading message"
      );
    }
  }


  // Gửi tin nhắn
  @ApiResponse({
    status: 200,
    type: [MessageSchema],
    description: "Successful",
  })
  @Post('send')
  async sendMessage(
    @Body() messageRequest: MessageRequest,
    @Req() req: Request & { user?: UserGuardModel },
  ) {
    try {
      let senderId = (await this.userService.getUserByAccountId(req.user.accountId)).id;
      messageRequest.senderId = senderId;
      return this.chatGateWay.handleMessage(messageRequest, {} as Socket)
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "Error when sending message"
      );
    }
  }
}
