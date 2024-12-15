import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { GroupChatSchema } from "./schema/groupChat.schema";
import { ApiResponse } from "@nestjs/swagger";
import { GroupChatGateway } from "./groupChat.gateway";
import { Socket } from "socket.io";
import { groupChatRequest } from "./dto/groupChat.request";
import { GroupChatService } from "./groupChat.service";

@Controller("groupChat")
export class GroupChatController {
  constructor(
    private userService: UserService,
    private groupChatService: GroupChatService,
    private readonly groupChatGateway: GroupChatGateway
  ) {}

  @ApiResponse({
    status: 200,
    type: [GroupChatSchema],
    description: "Successful",
  })
  @Get(":id")
  async getGroupChat(@Param("id") id: string, @Req() req: Request) {
    const authorizationHeader = (req.headers as any)["authorization"];

    const userId = authorizationHeader.split(" ")[1];
    if (!userId) {
      throw new Error("Invalid authorization header format");
    }
    console.log("User id:", userId);
    return this.groupChatGateway.handleGetById({} as Socket, id);
  }

  @Post("")
  async createGroupChat(
    @Body() groupChatRequest: groupChatRequest,
    @Req() req: Request
  ) {
    try {
      const authorizationHeader = (req.headers as any)["authorization"];
      const userId = authorizationHeader.split(" ")[1]; // Bỏ chữ "Bearer"

      if (!userId) {
        throw new Error("Invalid authorization header format");
      }
      console.log("User id:", userId);

      return await this.groupChatService.saveGroupChat(groupChatRequest);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error when creating group");
    }
  }
}
