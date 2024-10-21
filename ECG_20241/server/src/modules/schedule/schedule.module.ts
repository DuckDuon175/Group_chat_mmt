import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ScheduleModel } from "../../entities/schedule.model";
import { ScheduleTypeModel } from "../../entities/schedule_type.model";
import { ScheduleStatusModel } from "../../entities/schedule_status.model";
import { RecurringScheduleModel } from "../../entities/recurring_schedule.model";
import { RecurrenceTypeModel } from "../../entities/recurrence_type.model";
import { ConsultationScheduleModel } from "../../entities/consultation_schedule.model";
import { DiagnosisModel } from "../../entities/diagnosis.model";
import { UserModel } from "../../entities/user.model";
import { RecordModel } from "../../entities/record.model";
import { DeviceScheduleModel } from "../../entities/device_schedule.model";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { ScheduleRepository } from "./schedule.repository";

import { UserModule } from "../user/user.module";
import { ConsultationScheduleModule } from "../consultation_schedule/consultation_schedule.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      ScheduleModel,
      ScheduleTypeModel,
      ScheduleStatusModel,
      RecurrenceTypeModel,
      RecurringScheduleModel,
      ConsultationScheduleModel,
      DiagnosisModel,
      UserModel,
      RecordModel,
      DeviceScheduleModel,
    ]),
    UserModule,
    ConsultationScheduleModule
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService],
})
export class ScheduleModule { }
