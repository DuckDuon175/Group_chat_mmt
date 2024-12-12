import { ConsultationScheduleResponse } from "./dto/consultation_schedule.response";
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConsultationScheduleModel } from "../../entities/consultation_schedule.model";
import { ConsultationScheduleRequest } from "./dto/consultation_schedule.request";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class ConsultationScheduleRepository {
  constructor(
    @InjectModel(ConsultationScheduleModel)
    private consultationScheduleModel: typeof ConsultationScheduleModel
  ) {}

  async getAllConsultationSchedule(): Promise<ConsultationScheduleResponse[]> {
    return await this.consultationScheduleModel.findAll();
  }

  async getConsultationScheduleByScheduleId(
    schedule_id: string
  ): Promise<ConsultationScheduleResponse> {
    return await this.consultationScheduleModel.findOne({
      where: { schedule_id: schedule_id },
    });
  }

  async getConsultationScheduleByDoctorId(
    doctor_id: string
  ): Promise<ConsultationScheduleResponse[]> {
    return await this.consultationScheduleModel.findAll({
      where: { doctor_id: doctor_id },
    });
  }

  async addConsultationSchedule(consultation: ConsultationScheduleRequest) {
    return await this.consultationScheduleModel.create({
      id: consultation.id,
      doctor_id: consultation.doctor_id,
      schedule_id: consultation.schedule_id,
    });
  }

  async deleteConsultationByScheduleId(schedule_id: string) {
    return await this.consultationScheduleModel.destroy({
      where: { schedule_id: schedule_id },
    });
  }
}
