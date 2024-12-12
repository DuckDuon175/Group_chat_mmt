import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RecordModel } from "../../entities/record.model";
import { RecordRequest } from "./dto/record.request";
import { RecordResponse } from "./dto/record.response";
const sequelize = require("../../config/sequelize");

@Injectable()
export class RecordRepository {
  constructor(
    @InjectModel(RecordModel)
    private recordModel: typeof RecordModel
  ) {}

  async getAllRecord(): Promise<RecordResponse[]> {
    return await this.recordModel.findAll();
  }

  async countRecordsPerMonth() {
    const [result, metadata] = await this.recordModel.sequelize.query(
      "SELECT EXTRACT(MONTH FROM FROM_UNIXTIME(start_time)) AS month, COUNT(*) AS record_count FROM records GROUP BY month ORDER BY month"
    );
    return result;
  }

  async add(record: RecordRequest) {
    return await this.recordModel.create({
      id: record.id,
      patient_id: record.patient_id,
      device_id: record.device_id,
      schedule_id: record.schedule_id,
      start_time: record.start_time,
      end_time: record.end_time,
      data_rec_url: record.data_rec_url,
    });
  }

  async updateRecordById(record: RecordRequest, id: string) {
    return await this.recordModel.update(
      {
        patient_id: record.patient_id,
        device_id: record.device_id,
        schedule_id: record.schedule_id,
        start_time: record.start_time,
        end_time: record.end_time,
        data_rec_url: record.data_rec_url,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async getRecordById(id: string): Promise<RecordResponse> {
    return await this.recordModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async getRecordByPatientId(patient_id: string): Promise<RecordResponse[]> {
    return await this.recordModel.findAll({
      where: {
        patient_id: patient_id,
      },
    });
  }

  async getRecordByDeviceId(device_id: string): Promise<RecordResponse[]> {
    return await this.recordModel.findAll({
      where: {
        device_id: device_id,
      },
    });
  }

  async deleteRecordById(id: string) {
    return await this.recordModel.destroy({
      where: {
        id: id,
      },
    });
  }
}
