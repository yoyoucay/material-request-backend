import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@ApiTags('Material Requests')
@Controller('api/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material request' })
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all material requests' })
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update request' })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve request' })
  approve(@Param('id') id: string, @Body('approvedById') approvedById: string) {
    return this.requestsService.approve(id, approvedById);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject request' })
  reject(@Param('id') id: string) {
    return this.requestsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete request' })
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }
}