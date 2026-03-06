import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDetailDto } from './dto/create-request-detail.dto';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';

@ApiTags('Material Requests')
@Controller('api/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new material request' })
  @ApiResponse({ status: 201, description: 'Request created successfully', type: Request })
  async create(@Body() createRequestDto: CreateRequestDto): Promise<Request | null> {
    return this.requestsService.create(createRequestDto, 1);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active material requests' })
  @ApiResponse({ status: 200, description: 'List of all requests', type: [Request] })
  async findAll(): Promise<Request[]> {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request found', type: Request })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async findOne(@Param('id') id: number): Promise<Request> {
    return this.requestsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update request' })
  @ApiResponse({ status: 200, description: 'Request updated successfully', type: Request })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto): Promise<Request> {
    return this.requestsService.update(id, updateRequestDto, 1);
  }

  @Post(':id/details')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add detail to request' })
  @ApiResponse({ status: 201, description: 'Request detail added successfully', type: RequestDetail })
  async addDetail(
    @Param('id') id: number,
    @Body() createRequestDetailDto: CreateRequestDetailDto,
  ): Promise<RequestDetail> {
    return this.requestsService.addRequestDetail(id, createRequestDetailDto, 1);
  }

  @Put('details/:detailId')
  @ApiOperation({ summary: 'Update request detail' })
  @ApiResponse({ status: 200, description: 'Request detail updated successfully', type: RequestDetail })
  async updateDetail(
    @Param('detailId') detailId: number,
    @Body() createRequestDetailDto: CreateRequestDetailDto,
  ): Promise<RequestDetail> {
    return this.requestsService.updateRequestDetail(detailId, createRequestDetailDto, 1);
  }

  @Delete('details/:detailId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove request detail' })
  @ApiResponse({ status: 204, description: 'Request detail removed successfully' })
  async removeDetail(@Param('detailId') detailId: number): Promise<void> {
    return this.requestsService.removeRequestDetail(detailId, 1);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate request' })
  @ApiResponse({ status: 204, description: 'Request deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.requestsService.remove(id, 1);
  }
}