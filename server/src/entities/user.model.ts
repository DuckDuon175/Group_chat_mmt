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
import { v4 as uuidv4 } from "uuid";

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
    validate: {
        isEmail: true, 
    },
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false, 
  })
  password: string;

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
}
