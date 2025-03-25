import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthJwtModule } from './auth/jwt.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    AuthJwtModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
