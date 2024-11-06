import { RecordRequest } from "./dto/record.request";
import { RecordResponse } from "./dto/record.response";
import { RecordRepository } from "./record.repository";
import { Injectable } from "@nestjs/common";
import { DeviceService } from "../device/device.service";
import { UserService } from "../user/user.service";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class RecordService {
  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private recordRepository: RecordRepository
  ) {}

  async add(record: RecordRequest) {
    record.id = uuidv4();
    return await this.recordRepository.add(record);
  }

  async getAllRecord(): Promise<RecordResponse[]> {
    let result = [];
    let records = await this.recordRepository.getAllRecord();
    for (const record of records) {
      let user = await this.userService.getUserById(record.patient_id);
      let device = await this.deviceService.getById(record.device_id);
      result.push({
        ...(<any>record).dataValues,
        username: user.username,
        device_name: device.device_name,
      });
    }
    return result;
  }

  async getRecordById(id: string): Promise<RecordResponse> {
    let record = await this.recordRepository.getRecordById(id);
    let user = await this.userService.getUserById(record.patient_id);
    let device = await this.deviceService.getById(record.device_id);
    return {
      ...(<any>record).dataValues,
      username: user.username,
      device_name: device.device_name,
    };
  }

  async getRecordByDeviceName(device_name: string): Promise<RecordResponse[]> {
    let result = [];
    let devices = await this.deviceService.getByDeviceName(device_name);
    for (const device of devices) {
      let records = await this.recordRepository.getRecordByDeviceId(device.id);
      const recordsWithDeviceName = records.map((record: any) => {
        return {
          ...record.dataValues,
          device_name: device_name,
        };
      });
      result.push(...recordsWithDeviceName);
    }
    return result;
  }

  async updateRecordById(record: RecordRequest, id: string) {
    return await this.recordRepository.updateRecordById(record, id);
  }

  async deleteRecordById(id: string) {
    return await this.recordRepository.deleteRecordById(id);
  }
}