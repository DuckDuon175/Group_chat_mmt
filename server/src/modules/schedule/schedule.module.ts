import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ScheduleModel } from "../../entities/schedule.model";
import { ScheduleTypeModel } from "../../entities/schedule_type.model";
import { ScheduleStatusModel } from "../../entities/schedule_status.model";
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
import { DiagnosisModule } from "../diagnosis/diagnosis.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      ScheduleModel,
      ScheduleTypeModel,
      ScheduleStatusModel,
      ConsultationScheduleModel,
      DiagnosisModel,
      UserModel,
      RecordModel,
      DeviceScheduleModel,
    ]),
    forwardRef(() => UserModule),
    ConsultationScheduleModule,
    DiagnosisModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService],
})
export class ScheduleModule {}
