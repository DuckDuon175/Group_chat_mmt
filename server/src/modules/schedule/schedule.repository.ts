import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ScheduleModel } from "../../entities/schedule.model";
import { ScheduleResponse } from "./dto/schedule.response";
import { ScheduleRequest } from "./dto/schedule.request";
import { stat } from "fs";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel(ScheduleModel)
    private scheduleModel: typeof ScheduleModel
  ) {}

  async getAllSchedules(): Promise<ScheduleResponse[]> {
    return await this.scheduleModel.findAll();
  }

  async createSchedule(schedule: ScheduleRequest) {
    try {
      return await this.scheduleModel.create({
        id: schedule.id,
        patient_id: schedule.patient_id,
        schedule_start_time: schedule.schedule_start_time,
        schedule_end_time: schedule.schedule_end_time,
        schedule_type_id: schedule.schedule_type_id,
        status_id: schedule.status_id ?? 1,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getScheduleById(id: string): Promise<ScheduleResponse> {
    try {
      return await this.scheduleModel.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getScheduleByStartTime(startTime: number): Promise<ScheduleResponse[]> {
    try {
      return await this.scheduleModel.findAll({
        where: {
          schedule_start_time: startTime,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async acceptSchedule(id: string) {
    return await this.scheduleModel.update(
      {
        status_id: 1,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
  async updateScheduleById(schedule: ScheduleRequest, id: string) {
    try {
      return await this.scheduleModel.update(
        {
          id: schedule.id,
          patient_id: schedule.patient_id,
          schedule_start_time: schedule.schedule_start_time,
          schedule_end_time: schedule.schedule_end_time,
          schedule_type_id: schedule.schedule_type_id,
          status_id: schedule.status_id,
        },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async deleteScheduleById(id: string) {
    try {
      return await this.scheduleModel.destroy({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getScheduleByPatientId(
    patient_id: string
  ): Promise<ScheduleResponse[]> {
    try {
      return await this.scheduleModel.findAll({
        where: {
          patient_id: patient_id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
