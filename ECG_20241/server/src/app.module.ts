import { AuthorizationGuard } from './modules/common/guards/authorization.guard';
import { Module} from "@nestjs/common"
import { AccountModule } from "./modules/account/account.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthenModule } from "./modules/authen/authen.module";
import { APP_GUARD } from "@nestjs/core";


@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql', 
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'codung2909.',
            database: 'identity',
            autoLoadModels: true,
            synchronize: true,
          }),
        AccountModule,
        AuthenModule
    ],
})

export class AppModule {}