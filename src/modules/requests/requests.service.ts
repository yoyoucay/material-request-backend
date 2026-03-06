import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequest, RequestStatus } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UsersService } from '../users/users.service';
import { MaterialsService } from '../materials/materials.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(MaterialRequest)
    private requestsRepository: Repository<MaterialRequest>,
    private usersService: UsersService,
    private materialsService: MaterialsService,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<MaterialRequest> {
    const user = await this.usersService.findOne(createRequestDto.requestedById);
    const material = await this.materialsService.findOne(createRequestDto.materialId);

    const requestNumber = `REQ-${Date.now()}`;
    const request = this.requestsRepository.create({
      ...createRequestDto,
      requestNumber,
      requestedBy: user,
      material,
    });

    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<MaterialRequest[]> {
    return this.requestsRepository.find({
      relations: ['requestedBy', 'material', 'approvedBy'],
    });
  }

  async findOne(id: string): Promise<MaterialRequest> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['requestedBy', 'material', 'approvedBy'],
    });
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<MaterialRequest> {
    const request = await this.findOne(id);

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be updated');
    }

    Object.assign(request, updateRequestDto);
    return this.requestsRepository.save(request);
  }

  async approve(id: string, approvedById: string): Promise<MaterialRequest> {
    const request = await this.findOne(id);
    const approver = await this.usersService.findOne(approvedById);

    request.status = RequestStatus.APPROVED;
    request.approvedBy = approver;
    request.approvalDate = new Date();

    return this.requestsRepository.save(request);
  }

  async reject(id: string): Promise<MaterialRequest> {
    const request = await this.findOne(id);
    request.status = RequestStatus.REJECTED;
    return this.requestsRepository.save(request);
  }

  async remove(id: string): Promise<void> {
    const request = await this.findOne(id);
    await this.requestsRepository.remove(request);
  }
}