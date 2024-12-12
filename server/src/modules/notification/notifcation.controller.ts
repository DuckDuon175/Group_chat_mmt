import {
  Controller,
  Get,
  Req,
  Res,
  Body,
  Post,
  InternalServerErrorException,
  Delete,
  Param,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { plainToInstance } from "class-transformer";
import { NotificationResponse } from "./dto/notification.response";
import { Response } from "express";
import { UserGuardModel } from "../authentication/dto/user.guard.model";
import { UserService } from "../user/user.service";
import { NotificationRequest } from "./dto/notification.request";
import { UpdateSeenStatusRequest } from "./dto/updateSeenStatus.request";

@Controller("notification")
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  @Get("")
  @ApiResponse({
    status: 200,
    type: [NotificationResponse],
    description: "Successfully",
  })
  async getAllNotifications(@Res() res: Response) {
    try {
      const notifications =
        await this.notificationService.getAllNotifications();
      const result = plainToInstance(NotificationResponse, notifications);
      return res.json(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        "Error when get all notifications"
      );
    }
  }

  @Get("get")
  @ApiResponse({
    status: 200,
    type: [NotificationResponse],
    description: "Successfully",
  })
  async getNotificationByUserId(
    @Req() req: Request & { user?: UserGuardModel },
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.getUserByAccountId(
        req.user.accountId
      );
      const notificationList =
        await this.notificationService.getNotificationByUserId(user.id);

      console.log(
        `[P]:::Get notifications by ${
          user.role_id === 3 ? "patient" : "doctor"
        }`,
        user.id
      );

      const notificationResult = notificationList.filter((notification) =>
        user.role_id === 3 ? notification.type === 0 : notification.type === 1
      );

      const result = plainToInstance(NotificationResponse, notificationResult);
      return res.json(result);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        "Error when getting notifications"
      );
    }
  }

  @Post("")
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: "Successfully",
  })
  async createNotification(
    @Req() req: Request & { user?: UserGuardModel },
    @Body() notification: NotificationRequest,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.getUserByAccountId(
        req.user.accountId
      );
      notification.is_seen = false;
      notification.type = user.role_id === 3 ? 1 : 0;
      if (user.role_id === 2) notification.doctor_id = user.id;
      if (user.role_id === 3) notification.patient_id = user.id;
      console.log("[P]:::Create notification data", notification);
      await this.notificationService.add(notification);
      return res.json({
        message: "Notification added successfully",
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Error when post notification");
    }
  }

  @Post("update-seen")
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: "Successfully",
  })
  async updateSeenStatus(
    @Body() seenStatusRequest: UpdateSeenStatusRequest,
    @Res() res: Response
  ) {
    console.log("[P]:::Update seen status: ", seenStatusRequest.id);
    try {
      await this.notificationService.updateSeenStatus(seenStatusRequest.id);
      return res.json({
        message: "Seen status updated successfully",
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Error when update seen status");
    }
  }
  
  @Delete(":id")
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: "Successfully",
  })
  async deleteNotification(@Res() res: Response, @Param("id") id: string) {
    console.log("[P]:::Delete notification by id: ", id);
    try {
      await this.notificationService.deleteNotification(id);
      return res.json({
        message: "Notification deleted successfully",
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException("Error when delete notification");
    }
  }
}
