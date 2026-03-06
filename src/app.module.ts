import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MaterialsModule } from './materials/materials.module';
import { RequestsModule } from './requests/requests.module';
import { User } from './users/entities/user.entity';
import { Password } from './users/entities/password.entity';
import { Material } from './materials/entities/material.entity';
import { Request } from './requests/entities/request.entity';
import { RequestDetail } from './requests/entities/request-detail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'material_request',
      entities: [User, Password, Material, Request, RequestDetail],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    MaterialsModule,
    RequestsModule,
  ],
})
export class AppModule {}