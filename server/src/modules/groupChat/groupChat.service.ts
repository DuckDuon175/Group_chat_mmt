import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GroupChatSchema } from "./schema/groupChat.schema";
import { Model } from "mongoose";
import { groupChatRequest } from "./dto/groupChat.request";

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChatSchema.name)
    private groupChatModel: Model<GroupChatSchema>
  ) {}

  async getGroupChatByUserId(
    user_id: string,
  ): Promise<GroupChatSchema[]> {
    return await this.groupChatModel.find({
      $or: [
        { hostId: user_id }, 
        { member: user_id }  
      ]
    }).exec();
  }

  async saveGroupChat(
    groupChatRequest: groupChatRequest
  ): Promise<GroupChatSchema> {
    const groupChat = new this.groupChatModel(groupChatRequest);
    groupChat.sendEvent = `sendMessageTo${groupChat.id}`;
    groupChat.receiveEvent = `receiveMessageFrom${groupChat.id}`;
    console.log(groupChat)
    return await groupChat.save();
  }

  async updateGroupChat(
    groupChatRequest: groupChatRequest,
    id: string
  ): Promise<GroupChatSchema> {
    const groupChat = await this.groupChatModel.findById(id);
    Object.assign(groupChat, groupChatRequest);
    return await groupChat.save();
  }

  async deleteGroupChat(id: string) {
    return await this.groupChatModel.findByIdAndDelete(id);
  }

  async findGroupChatById(id: string) {
    return await this.groupChatModel.findById(id);
  }
}
