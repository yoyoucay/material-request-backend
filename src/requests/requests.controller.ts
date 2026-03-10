import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateRequestDetailDto } from './dto/create-request-detail.dto';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Material Requests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new material request' })
  @ApiResponse({ status: 201, description: 'Request created successfully', type: Request })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createRequestDto: CreateRequestDto, @CurrentUser() user: User): Promise<Request | null> {
    return this.requestsService.create(createRequestDto, user.iUserID);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active material requests' })
  @ApiResponse({ status: 200, description: 'List of all requests', type: [Request] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<Request[]> {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request found', type: Request })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Request> {
    return this.requestsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update request' })
  @ApiResponse({ status: 200, description: 'Request updated successfully', type: Request })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequestDto: UpdateRequestDto,
    @CurrentUser() user: User,
  ): Promise<Request> {
    return this.requestsService.update(id, updateRequestDto, user.iUserID);
  }

  @Post(':id/details')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add detail to request' })
  @ApiResponse({ status: 201, description: 'Request detail added successfully', type: RequestDetail })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRequestDetailDto: CreateRequestDetailDto,
    @CurrentUser() user: User,
  ): Promise<RequestDetail> {
    return this.requestsService.addRequestDetail(id, createRequestDetailDto, user.iUserID);
  }

  @Put('details/:detailId')
  @ApiOperation({ summary: 'Update request detail' })
  @ApiResponse({ status: 200, description: 'Request detail updated successfully', type: RequestDetail })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateDetail(
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() createRequestDetailDto: CreateRequestDetailDto,
    @CurrentUser() user: User,
  ): Promise<RequestDetail> {
    return this.requestsService.updateRequestDetail(detailId, createRequestDetailDto, user.iUserID);
  }

  @Delete('details/:detailId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove request detail' })
  @ApiResponse({ status: 204, description: 'Request detail removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeDetail(@Param('detailId', ParseIntPipe) detailId: number, @CurrentUser() user: User): Promise<void> {
    return this.requestsService.removeRequestDetail(detailId, user.iUserID);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate request' })
  @ApiResponse({ status: 204, description: 'Request deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<void> {
    return this.requestsService.remove(id, user.iUserID);
  }
}