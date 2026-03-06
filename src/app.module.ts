import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaterialRequest } from './modules/requests/entities/request.entity';
import { MaterialDetail } from './modules/material-details/entities/material-detail.entity';
import { User } from './modules/users/entities/user.entity';
import { UserPassword } from './modules/users/entities/user-password.entity';
import { Material } from './modules/materials/entities/material.entity';

import { RequestsModule } from './modules/requests/requests.module';
import { UsersModule } from './modules/users/users.module';
import { MaterialsModule } from './modules/materials/materials.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Pass1234',
      database: 'material_request_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    MaterialsModule,
    RequestsModule,
  ],
})
export class AppModule {}
