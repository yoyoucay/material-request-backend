import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Materials')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully', type: Material })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Material code already exists' })
  async create(@Body() createMaterialDto: CreateMaterialDto, @CurrentUser() user: User): Promise<Material> {
    return this.materialsService.create(createMaterialDto, user.iUserID);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active materials' })
  @ApiResponse({ status: 200, description: 'List of all materials', type: [Material] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<Material[]> {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiResponse({ status: 200, description: 'Material found', type: Material })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Material> {
    return this.materialsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update material' })
  @ApiResponse({ status: 200, description: 'Material updated successfully', type: Material })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @CurrentUser() user: User,
  ): Promise<Material> {
    return this.materialsService.update(id, updateMaterialDto, user.iUserID);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate material' })
  @ApiResponse({ status: 204, description: 'Material deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<void> {
    return this.materialsService.remove(id, user.iUserID);
  }
}