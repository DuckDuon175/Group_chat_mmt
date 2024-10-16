import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthenticationModule } from './module/authentication/authentication.module';

import { MicroserviceModule } from './module/microservice/microservice.module';

import { RsaKeyModule } from './module/rsa_key/rsa_key.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load file cấu hình database
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql', // Kiểu cơ sở dữ liệu (MySQL)
        host: configService.get<string>('DB_HOST'), // Lấy host từ biến môi trường
        port: configService.get<number>('DB_PORT'), // Port dạng số
        username: configService.get<string>('DB_USER'), // Tên người dùng MySQL
        password: configService.get<string>('DB_PASSWORD'), // Mật khẩu MySQL
        database: configService.get<string>('DB_NAME'), // Tên cơ sở dữ liệu
        models: [], // Đăng ký model Sequelize
        autoLoadModels: true, // Tự động tạo bảng nếu chưa có
        synchronize: true, // Đồng bộ hóa model với cơ sở dữ liệu
      }),
    }),
    AuthenticationModule,
    MicroserviceModule,
    RsaKeyModule,
    RsaKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
