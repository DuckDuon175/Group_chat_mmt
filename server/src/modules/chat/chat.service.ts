import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageSchema } from "./schema/message.schema";
import { MessageRequest } from "./dto/message.request";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MessageSchema.name) private chatModel: Model<MessageSchema>
  ) {}

  // Lưu tin nhắn vào MongoDB
  async saveMessage(messageRequest: MessageRequest): Promise<MessageSchema> {
    console.log(messageRequest);
    const chat = new this.chatModel(messageRequest);
    return chat.save();
  }

  async getMessageByGroupId(groupId: string): Promise<MessageSchema[]> {
    return await this.chatModel.find({
      groupChatId: groupId,
    });
  }

  // Lấy tin nhắn giữa hai người dùng hoặc trong nhóm
  async loadMessages(messageRequest: MessageRequest): Promise<MessageSchema[]> {
    console.log(messageRequest.senderId);
    let senderId = messageRequest.senderId;
    let receiverId = messageRequest.receiverId;
    if (messageRequest.groupChatId != null) {
      var groupChatId = messageRequest.groupChatId;
      // Nếu là chat nhóm, tìm tin nhắn trong nhóm
      return this.chatModel.find({ groupChatId }).sort({ timestamp: 1 });
    } else {
      console.log("chat cá nhân");
      // Nếu là chat cá nhân, lấy tin nhắn giữa hai người
      return this.chatModel
        .find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        })
        .sort({ timestamp: 1 });
    }
  }
}
