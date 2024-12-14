import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupChatSchema } from "./schema/groupChat.schema";
import { GroupChatController } from "./groupChat.controller";
import { GroupChatService } from "./groupChat.service";
import { GroupChatGateway } from "./groupChat.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupChatSchema.name, schema: GroupChatSchema },
    ]),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService, GroupChatGateway],
  exports: [GroupChatService],
})
export class GroupChatModule {}
