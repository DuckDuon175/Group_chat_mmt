import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
} from "sequelize-typescript";
import { UserRoleModel } from "./user_role.model";
import { UserStatusModel } from "./user_status.model";

import { DeviceModel } from "./device.model";
import { ScheduleModel } from "./schedule.model";
import { ConsultationScheduleModel } from "./consultation_schedule.model";
import { RecordModel } from "./record.model";
import { v4 as uuidv4 } from "uuid";
import { NotificationScheduleModel } from "./notification_schedule.model";

@Table({ tableName: "users" })
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.STRING(255),
    defaultValue: () => uuidv4(),
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  account_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  gender: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  birth: bigint;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image: string;

  @ForeignKey(() => UserRoleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;

  @ForeignKey(() => UserStatusModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  status_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  information: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @BelongsTo(() => UserRoleModel)
  user_role: UserRoleModel;

  @BelongsTo(() => UserStatusModel)
  user_status: UserStatusModel;

  @HasMany(() => DeviceModel)
  devices: DeviceModel[];

  @HasMany(() => RecordModel)
  records: RecordModel[];

  @HasMany(() => ScheduleModel)
  schedules: ScheduleModel[];

  @HasMany(() => ConsultationScheduleModel)
  consultation_schedules: ConsultationScheduleModel[];

  @HasMany(() => NotificationScheduleModel)
  notification_schedules: NotificationScheduleModel[];
}
