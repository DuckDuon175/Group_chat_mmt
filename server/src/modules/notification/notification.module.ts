import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotificationController } from "./notifcation.controller";
import { NotificationService } from "./notification.service";
import { NotificationRepository } from "./notification.repository";
import { UserModule } from "../user/user.module";
import { NotificationScheduleModel } from "../../entities/notification_schedule.model";
import { UserModel } from "../../entities/user.model";

@Module({
  imports: [
    SequelizeModule.forFeature([NotificationScheduleModel, UserModel]),
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
