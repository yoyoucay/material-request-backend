import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDetailDto } from './dto/create-request-detail.dto';
import { EntityStatus } from '../common/constants/enums';
import { MaterialsService } from '../materials/materials.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    @InjectRepository(RequestDetail)
    private requestDetailsRepository: Repository<RequestDetail>,
    private materialsService: MaterialsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, iCreateBy: number): Promise<Request | null> {
    // Validate all materials exist
    for (const detail of createRequestDto.requestDetails) {
      await this.materialsService.findByCode(detail.sMaterialCode);
    }

    // Create request
    const request = this.requestsRepository.create({
      sReqNumber: createRequestDto.sReqNumber,
      sDept: createRequestDto.sDept,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy,
    });

    const savedRequest = await this.requestsRepository.save(request);

    // Create request details
    for (const detail of createRequestDto.requestDetails) {
      const requestDetail = this.requestDetailsRepository.create({
        iRequestID: savedRequest.iRequestID,
        sMaterialCode: detail.sMaterialCode,
        decQty: detail.decQty,
        sDesc: detail.sDesc,
        iStatus: EntityStatus.ACTIVE,
        iCreateBy,
      });

      await this.requestDetailsRepository.save(requestDetail);
    }

    // Load full request with details
    return this.requestsRepository.findOne({
      where: { iRequestID: savedRequest.iRequestID },
      relations: ['requestDetails'],
    });
  }

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({
      where: { iStatus: EntityStatus.ACTIVE },
      relations: ['requestDetails'],
    });
  }

  async findOne(iRequestID: number): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { iRequestID },
      relations: ['requestDetails'],
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${iRequestID} not found`);
    }

    return request;
  }

  async update(iRequestID: number, updateRequestDto: UpdateRequestDto, iUpdatedBy: number): Promise<Request> {
    const request = await this.findOne(iRequestID);

    Object.assign(request, updateRequestDto, { iUpdatedBy, dtUpdated: new Date() });

    return this.requestsRepository.save(request);
  }

  async addRequestDetail(
    iRequestID: number,
    createRequestDetailDto: CreateRequestDetailDto,
    iCreateBy: number,
  ): Promise<RequestDetail> {
    const request = await this.findOne(iRequestID);

    // Validate material exists
    await this.materialsService.findByCode(createRequestDetailDto.sMaterialCode);

    const requestDetail = this.requestDetailsRepository.create({
      iRequestID,
      sMaterialCode: createRequestDetailDto.sMaterialCode,
      decQty: createRequestDetailDto.decQty,
      sDesc: createRequestDetailDto.sDesc,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy,
    });

    return this.requestDetailsRepository.save(requestDetail);
  }

  async updateRequestDetail(
    iDetailID: number,
    createRequestDetailDto: CreateRequestDetailDto,
    iUpdatedBy: number,
  ): Promise<RequestDetail> {
    const requestDetail = await this.requestDetailsRepository.findOne({
      where: { iDetailID },
    });

    if (!requestDetail) {
      throw new NotFoundException(`Request detail with ID ${iDetailID} not found`);
    }

    // Validate material exists
    await this.materialsService.findByCode(createRequestDetailDto.sMaterialCode);

    Object.assign(requestDetail, createRequestDetailDto, { iUpdatedBy, dtUpdated: new Date() });

    return this.requestDetailsRepository.save(requestDetail);
  }

  async removeRequestDetail(iDetailID: number, iUpdatedBy: number): Promise<void> {
    const requestDetail = await this.requestDetailsRepository.findOne({
      where: { iDetailID },
    });

    if (!requestDetail) {
      throw new NotFoundException(`Request detail with ID ${iDetailID} not found`);
    }

    requestDetail.iStatus = EntityStatus.INACTIVE;
    requestDetail.iUpdatedBy = iUpdatedBy;
    requestDetail.dtUpdated = new Date();

    await this.requestDetailsRepository.save(requestDetail);
  }

  async remove(iRequestID: number, iUpdatedBy: number): Promise<void> {
    const request = await this.findOne(iRequestID);
    request.iStatus = EntityStatus.INACTIVE;
    request.iUpdatedBy = iUpdatedBy;
    request.dtUpdated = new Date();
    await this.requestsRepository.save(request);
  }
}