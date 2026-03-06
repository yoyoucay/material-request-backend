import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@ApiTags('Materials')
@Controller('api/materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material' })
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update material' })
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete material' })
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}