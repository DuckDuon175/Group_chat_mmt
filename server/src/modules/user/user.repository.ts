import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../entities/user.model";
import { UserRequest } from "./dto/user.request";
import { UserResponse } from "./dto/user.response";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel
  ) {}

  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userModel.findAll();
  }

  async add(user: UserRequest) {
    return await this.userModel.create({
      email: user.email,
      password: user.password,
      username: user.username,
      gender: user.gender,
      birth: user.birth,
      phone_number: user.phone_number,
      information: user.information,
    });
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    return await this.userModel.findOne({
      where: { email: email },
    });
  }

  async getUserByUserName(username: string): Promise<UserResponse[]> {
    return await this.userModel.findAll({
      where: { username: username },
    });
  }

  async getUserById(id: string): Promise<UserResponse> {
    return await this.userModel.findOne({
      where: { id: id },
    });
  }

  async updateUserById(user: UserRequest, id: string) {
    return await this.userModel.update(
      {
        id: user.id,
        password: user.password,
        username: user.username,
        gender: user.gender,
        birth: user.birth,
        phone_number: user.phone_number,
        information: user.information,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  async deleteUserById(id: string) {
    return await this.userModel.destroy({
      where: {
        id: id,
      },
    });
  }
}
