import { UserRequest } from "./dto/user.request";
import { UserResponse } from "./dto/user.response";
import { UserRepository } from "./user.repository";
const { v4: uuidv4 } = require("uuid");
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
  ) {}

  async register(user: UserRequest): Promise<UserResponse | null> {
    const existingUser = await this.userRepository.getUserByEmail(user.email);
    if (existingUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await this.userRepository.add({
      ...user,
      password: hashedPassword,
    });

    return createdUser;
  }

  async login(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }

    return user;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.userRepository.getAllUsers();
  }

  async add(user: UserRequest) {
    return await this.userRepository.add(user);
  }

  async getUserByUserName(username: string): Promise<UserResponse[]> {
    return await this.userRepository.getUserByUserName(username);
  }

  async getUserById(id: string): Promise<UserResponse> {
    return await this.userRepository.getUserById(id);
  }

  async updateUserById(user: UserRequest, id: string) {
    return await this.userRepository.updateUserById(user, id);
  }

  async deleteUserById(id: string) {
    return await this.userRepository.deleteUserById(id);
  }

}
