import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../entities/user.model";
import { UserRequest } from "./dto/user.request";
import { UserResponse } from "./dto/user.response";
import { UserRoleModel } from "../../entities/user_role.model";
import { UserStatusModel } from "../../entities/user_status.model";
const { v4: uuidv4 } = require("uuid");

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(UserRoleModel)
    private userRoleModel: typeof UserRoleModel,
    @InjectModel(UserStatusModel)
    private userStatusModel: typeof UserStatusModel
  ) { }

  // async getAllUsers(): Promise<UserResponse[]> {
  //   return await this.userModel.findAll();
  // }

  async getAllUsers(): Promise<UserResponse[]> {
    let users = await this.userModel.findAll({
      include: [
        {
          model: this.userRoleModel,
          attributes: ['role_name'],  
        },
        {
          model: this.userStatusModel,
          attributes: ['status_description'], 
        },
      ],
    });
  
    return Promise.all(users.map(user => this.convertUserModelToUserResponse(user)));
  }

  async add(user: UserRequest) {
    try {
      return await this.userModel.create({
        id: user.id,
        account_id: user.account_id,
        username: user.username,
        gender: user.gender,
        birth: user.birth,
        phone_number: user.phone_number,
        status_id: user.status_id,
        information: user.information,
        role_id: user.role_id,
      });
    } catch (error) {
      console.log("User.repository.add failed", error);
      throw new ConflictException("Email is currently existing");
    }
  }

  async getUserByUserName(username: string): Promise<UserResponse[]> {
    let users = await this.userModel.findAll({
      where: { username: username },
      include: [
        {
          model: this.userRoleModel,
          attributes: ['role_name'],  
        },
        {
          model: this.userStatusModel,
          attributes: ['status_description'], 
        },
      ],
    });

    return Promise.all(users.map(user => this.convertUserModelToUserResponse(user)));
  }

  async getUserById(id: string): Promise<UserResponse> {
    let user = await this.userModel.findOne({ 
      where: { id: id },
      include: [
        {
          model: this.userRoleModel,
          attributes: ['role_name'],  
        },
        {
          model: this.userStatusModel,
          attributes: ['status_description'], 
        },
      ], 
    });

    return this.convertUserModelToUserResponse(user);
  }

  async updateUserById(user: UserRequest, id: string) {
    try {
      return await this.userModel.update(
        {
          id: user.id,
          account_id: user.account_id,
          username: user.username,
          gender: user.gender,
          birth: user.birth,
          phone_number: user.phone_number,
          status_id: user.status_id,
          information: user.information,
          role_id: user.role_id,
        },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (error) {
      console.log("User.repository.update failed");
    }
  }

  async deleteUserById(id: string) {
    return await this.userModel.destroy({
      where: {
        id: id,
      },
    });
  }

  private async convertUserModelToUserResponse(userModel: UserModel): Promise<UserResponse> {
    return {
      id: userModel.id,
      account_id: userModel.account_id,
      username: userModel.username,
      gender: userModel.gender,
      birth: userModel.birth,
      phone_number: userModel.phone_number,
      information: userModel.information,
      status: userModel.user_status?.status_description,
      role: userModel.user_role?.role_name,
    };
  }
}
