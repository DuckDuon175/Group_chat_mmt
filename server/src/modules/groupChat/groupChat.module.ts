import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupChatSchema, GroupMessageSchema } from "./schema/groupChat.schema";
import { GroupChatController } from "./groupChat.controller";
import { GroupChatService } from "./groupChat.service";
import { GroupChatGateway } from "./groupChat.gateway";
import { ChatModule } from "../chat/chat.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupChatSchema.name, schema: GroupMessageSchema },
    ]),
    ChatModule,
    UserModule,
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService, GroupChatGateway],
  exports: [GroupChatService],
})
export class GroupChatModule {}
