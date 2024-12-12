import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { NotificationScheduleModel } from "../../entities/notification_schedule.model";
import { NotificationResponse } from "./dto/notification.response";
import { NotificationRequest } from "./dto/notification.request";
import { Op } from "sequelize";

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(NotificationScheduleModel)
    private notificationModel: typeof NotificationScheduleModel
  ) {}

  async getAllNotifications(): Promise<NotificationResponse[]> {
    return await this.notificationModel.findAll();
  }

  async add(notification: NotificationRequest) {
    return await this.notificationModel.create({
      id: notification.id,
      patient_id: notification.patient_id,
      doctor_id: notification.doctor_id,
      schedule_start_time: notification.schedule_start_time,
      is_seen: notification.is_seen,
      status: notification.status ?? 2,
      type: notification.type,
    });
  }

  async updateSeenStatus(id: string) {
    return await this.notificationModel.update(
      {
        is_seen: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async deleteById(id: string) {
    return await this.notificationModel.destroy({
      where: {
        id: id,
      },
    });
  }

  async deleteByUserId(id: string) {
    return await this.notificationModel.destroy({
      where: {
        [Op.or]: [{ patient_id: id }, { doctor_id: id }],
      },
    });
  }

  async getNotificationByUserId(id: string) {
    return await this.notificationModel.findAll({
      where: {
        [Op.or]: [{ patient_id: id }, { doctor_id: id }],
      },
    });
  }
}
