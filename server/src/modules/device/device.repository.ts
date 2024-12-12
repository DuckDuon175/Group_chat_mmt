import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DeviceModel } from "../../entities/device.model";
import { DeviceRequest } from "./dto/device.request";
import { DeviceResponse } from "./dto/device.response";
const sequelize = require("../../config/sequelize");

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(DeviceModel)
    private deviceModel: typeof DeviceModel
  ) {}

  async add(device: DeviceRequest) {
    return await this.deviceModel.create({
      id: device.id,
      doctor_id: device.doctor_id,
      device_name: device.device_name,
      information: device.information ?? "",
      device_type_id: device.device_type_id,
      status_id: device.status_id,
      start_date: device.start_date,
    });
  }

  async getAllData(): Promise<DeviceResponse[]> {
    return await this.deviceModel.findAll();
  }

  async getById(id: string): Promise<DeviceResponse> {
    return await this.deviceModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async getByUserId(doctor_id: string): Promise<DeviceResponse[]> {
    return await this.deviceModel.findAll({
      where: {
        doctor_id: doctor_id,
      },
    });
  }

  async getByDoctorId(doctor_id: string): Promise<DeviceResponse[]> {
    return await this.deviceModel.findAll({
      where: {
        doctor_id: doctor_id,
      },
    });
  }

  async getDeviceByDeviceName(device_name: string): Promise<DeviceResponse[]> {
    return await this.deviceModel.findAll({
      where: {
        device_name: device_name,
      },
    });
  }

  async updateById(device: DeviceRequest, id: string) {
    return await this.deviceModel.update(
      {
        doctor_id: device.doctor_id,
        device_name: device.device_name,
        information: device.information,
        device_type_id: device.device_type_id,
        status_id: device.status_id,
        start_date: device.start_date,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async deleteById(id: string) {
    return await this.deviceModel.destroy({
      where: {
        id: id,
      },
    });
  }

  async getByDeviceType(id: string) {
    return await this.deviceModel.findOne({
      where: {
        device_type_id: id,
      },
    });
  }

  async countDevicesPerMonth(): Promise<any[]> {
    const [result, metadata] = await this.deviceModel.sequelize.query(
      "SELECT EXTRACT(MONTH FROM FROM_UNIXTIME(start_date)) AS month, COUNT(*) AS device_count FROM devices GROUP BY month ORDER BY month"
    );
    return result;
  }
}
