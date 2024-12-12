import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { NotificationRepository } from "./notification.repository";
import { NotificationRequest } from "./dto/notification.request";
import { NotificationResponse } from "./dto/notification.response";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private notificationRepository: NotificationRepository
  ) {}

  async add(notification: NotificationRequest) {
    notification.id = uuidv4();
    return await this.notificationRepository.add(notification);
  }

  async getAllNotifications(): Promise<NotificationResponse[]> {
    const notificationList =
      await this.notificationRepository.getAllNotifications();
    return await getNotificationList(notificationList, this.userService);
  }

  async getNotificationByUserId(id: string): Promise<NotificationResponse[]> {
    const notificationList =
      await this.notificationRepository.getNotificationByUserId(id);
    return await getNotificationList(notificationList, this.userService);
  }

  async updateSeenStatus(id: string) {
    return await this.notificationRepository.updateSeenStatus(id);
  }

  async deleteNotification(id: string) {
    return await this.notificationRepository.deleteById(id);
  }
}

const getNotificationList = async (
  notificationList: NotificationResponse[],
  userService: UserService
): Promise<NotificationResponse[]> => {
  return await Promise.all(
    notificationList.map(async (notification) => {
      const patient_name = await userService
        .getUserById(notification.patient_id)
        .then((res) => res.username);
      const doctor_name = await userService
        .getUserById(notification.doctor_id)
        .then((res) => res.username);
      return {
        ...(<any>notification).dataValues,
        patient_name: patient_name,
        doctor_name: doctor_name,
      };
    })
  );
};
