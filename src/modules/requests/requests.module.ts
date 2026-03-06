import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MaterialRequest } from './entities/request.entity';
import { UsersModule } from '../users/users.module';
import { MaterialsModule } from '../materials/materials.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialRequest]),
    UsersModule,
    MaterialsModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}