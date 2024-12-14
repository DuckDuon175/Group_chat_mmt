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

  async saveGroupChat(
    groupChatRequest: groupChatRequest
  ): Promise<GroupChatSchema> {
    const groupChat = new this.groupChatModel(groupChatRequest);
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
