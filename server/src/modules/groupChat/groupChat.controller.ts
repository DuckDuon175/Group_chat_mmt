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

@Controller("groupChat")
export class GroupChatController {
  constructor(
    private userService: UserService,
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

      const newGroup = await this.groupChatGateway.handleCreateGroup(
        {} as Socket,
        groupChatRequest
      );

      return {
        message: "Group created successfully",
        data: newGroup,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error when creating group");
    }
  }
}
