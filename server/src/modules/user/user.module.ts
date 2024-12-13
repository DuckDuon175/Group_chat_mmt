import { UserRepository } from "./user.repository";
import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserService } from "./user.service";
import { UserModel } from "../../entities/user.model";

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
