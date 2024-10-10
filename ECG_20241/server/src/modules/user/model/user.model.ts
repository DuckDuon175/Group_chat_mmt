import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {

  @PrimaryKey
  @Column({
    type: DataType.STRING(255), 
    allowNull: false
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
    type: DataType.DATE,
    allowNull: true,
  })
  birth: number;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  status: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  information: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role: number;

  @Column({
    type: DataType.DATE
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE
  })
  updatedAt: Date;
  
}
