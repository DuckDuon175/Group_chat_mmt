import { UserService } from "../user/user.service";
import { DeviceDetailService } from "../device_details/device_detail.service";
import { DeviceRepository } from "./device.repository";
import { Injectable } from "@nestjs/common";
import { DeviceRequest } from "./dto/device.request";
import { DeviceResponse } from "./dto/device.response";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class DeviceService {
  constructor(
    private deviceRepository: DeviceRepository,
    private userService: UserService,
    private deviceDetailService: DeviceDetailService
  ) {}

  async getAllData(): Promise<DeviceResponse[]> {
    let result = [];
    let devices = await this.deviceRepository.getAllData();
    for (const device of devices) {
      let user = await this.userService.getUserById(device.doctor_id);
      let frequency =
        await this.deviceDetailService.getDetailByDeviceIdAndFreqType(
          device.id
        );
      let storage =
        await this.deviceDetailService.getDetailByDeviceIdAndStorageType(
          device.id
        );
      let connection =
        await this.deviceDetailService.getDetailByDeviceIdAndConnectionType(
          device.id
        );
      const deviceWithDoctorName = {
        ...(<any>device).dataValues,
        doctor_name: user.username,
        frequency: frequency,
        connection: connection,
        storage: storage,
      };
      result.push(deviceWithDoctorName);
    }
    return result;
  }

  async add(device: DeviceRequest) {
    device.id = uuidv4();
    await this.deviceRepository.add(device);
    for (const frequency of <any>device.frequency) {
      frequency.detail_type = 1;
      frequency.device_id = device.id;
      await this.deviceDetailService.addDetail(frequency);
    }
    for (const connection of <any>device.connection) {
      connection.detail_type = 2;
      connection.device_id = device.id;
      await this.deviceDetailService.addDetail(connection);
    }
    for (const storage of <any>device.storage) {
      storage.detail_type = 3;
      storage.device_id = device.id;
      await this.deviceDetailService.addDetail(storage);
    }
  }

  async updateById(device: DeviceRequest, id: string) {
    return await this.deviceRepository.updateById(device, id);
  }

  async getById(id: string): Promise<DeviceResponse> {
    let device = await this.deviceRepository.getById(id);
    let user = await this.userService.getUserById(device.doctor_id);
    let frequency =
      await this.deviceDetailService.getDetailByDeviceIdAndFreqType(device.id);
    let storage =
      await this.deviceDetailService.getDetailByDeviceIdAndStorageType(
        device.id
      );
    let connection =
      await this.deviceDetailService.getDetailByDeviceIdAndConnectionType(
        device.id
      );
    return {
      ...(<any>device).dataValues,
      doctor_name: user.username,
      frequency: frequency,
      connection: connection,
      storage: storage,
    };
  }

  async getByUserId(user_id: string): Promise<DeviceResponse[]> {
    return await this.deviceRepository.getByUserId(user_id);
  }

  async getByDoctorId(doctor_id: string): Promise<DeviceResponse[]> {
    return await this.deviceRepository.getByDoctorId(doctor_id);
  }

  async getByDeviceTypeId(device_type_id: string): Promise<DeviceResponse> {
    return await this.deviceRepository.getByDeviceType(device_type_id);
  }

  async getByDeviceName(name: string): Promise<DeviceResponse[]> {
    return await this.deviceRepository.getDeviceByDeviceName(name);
  }

  async countDevicesPerMonth(): Promise<any[]> {
    return await this.deviceRepository.countDevicesPerMonth();
  }

  async deleteById(id: string) {
    return await this.deviceRepository.deleteById(id);
  }
}
