import { Injectable } from "@nestjs/common";
import { DeviceService } from "../device/device.service";
import { UserService } from "../user/user.service";
import { RecordService } from "../record/record.service";
import { StatisticResponse } from "./dto/statistic.response";

@Injectable()
export class StatisticService {
  constructor(
    private userService: UserService,
    private deviceService: DeviceService,
    private recordService: RecordService
  ) {}

  async getStatistic(): Promise<StatisticResponse> {
    const users = await this.userService.countUsersPerMonth();
    const devices = await this.deviceService.countDevicesPerMonth();
    const records = await this.recordService.countRecordsPerMonth();
    return {
      ...users,
      device_array: devices,
      record_array: records,
    };
  }
}
