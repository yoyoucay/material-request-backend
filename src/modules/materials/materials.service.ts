import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const material = this.materialsRepository.create(createMaterialDto);
    return this.materialsRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return this.materialsRepository.find({ relations: ['createdBy'] });
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialDto);
    return this.materialsRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    await this.materialsRepository.remove(material);
  }
}