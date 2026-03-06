import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private repo: Repository<Request>,
  ) {}

  create(dto: CreateRequestDto) {
    const entity = this.repo.create({
      ...dto,
      dtCreated: new Date(),
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['details'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { iRequestID: id },
      relations: ['details'],
    });
  }

  update(id: number, dto: UpdateRequestDto) {
    return this.repo.update(id, {
      ...dto,
      dtUpdated: new Date(),
    });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
