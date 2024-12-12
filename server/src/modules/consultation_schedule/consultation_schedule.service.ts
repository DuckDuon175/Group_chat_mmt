const { v4: uuidv4 } = require("uuid");

import { Injectable } from "@nestjs/common";
import { ConsultationScheduleResponse } from "./dto/consultation_schedule.response";
import { ConsultationScheduleRepository } from "./consultation_schedule.repository";
import { ConsultationScheduleRequest } from "./dto/consultation_schedule.request";

@Injectable()
export class ConsultationScheduleService {
  constructor(
    private consultationScheduleRepository: ConsultationScheduleRepository
  ) {}

  async getConsultationScheduleByScheduleId(
    schedule_id: string
  ): Promise<ConsultationScheduleResponse> {
    return this.consultationScheduleRepository.getConsultationScheduleByScheduleId(
      schedule_id
    );
  }
  async getConsultationScheduleByDoctorId(
    doctorId: string
  ): Promise<ConsultationScheduleResponse[]> {
    return this.consultationScheduleRepository.getConsultationScheduleByDoctorId(
      doctorId
    );
  }

  async add(consultation: ConsultationScheduleRequest) {
    return this.consultationScheduleRepository.addConsultationSchedule(
      consultation
    );
  }

  async deleteConsultationByScheduleId(schedule_id: string) {
    return this.consultationScheduleRepository.deleteConsultationByScheduleId(
      schedule_id
    );
  }
}
