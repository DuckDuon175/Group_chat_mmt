import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecordModel } from "../../entities/record.model";
import { UserModel } from "../../entities/user.model";
import { DeviceModel } from "../../entities/device.model";
import { DeviceModule } from "../device/device.module";
import { UserModule } from "../user/user.module";
import { StatisticController } from "./statistic.controller";
import { StatisticService } from "./statistic.service";
import { RecordModule } from "../record/record.module";

@Module({
  imports: [
    // SequelizeModule.forFeature([
    //   RecordModel,
    //   DeviceModel,
    //   UserModel,
    // ]),
    UserModule,
    DeviceModule,
    RecordModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],
})
export class StatisticModule {}
