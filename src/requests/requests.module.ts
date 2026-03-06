import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';
import { MaterialsModule } from '../materials/materials.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request, RequestDetail]), MaterialsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}