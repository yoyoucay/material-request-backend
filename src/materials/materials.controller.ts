import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';

@ApiTags('Materials')
@Controller('api/materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully', type: Material })
  @ApiResponse({ status: 409, description: 'Material code already exists' })
  async create(@Body() createMaterialDto: CreateMaterialDto): Promise<Material> {
    return this.materialsService.create(createMaterialDto, 1);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active materials' })
  @ApiResponse({ status: 200, description: 'List of all materials', type: [Material] })
  async findAll(): Promise<Material[]> {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiResponse({ status: 200, description: 'Material found', type: Material })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async findOne(@Param('id') id: number): Promise<Material> {
    return this.materialsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update material' })
  @ApiResponse({ status: 200, description: 'Material updated successfully', type: Material })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async update(@Param('id') id: number, @Body() updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    return this.materialsService.update(id, updateMaterialDto, 1);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate material' })
  @ApiResponse({ status: 204, description: 'Material deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.materialsService.remove(id, 1);
  }
}