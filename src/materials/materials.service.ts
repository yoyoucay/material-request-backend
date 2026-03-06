import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { EntityStatus } from '../common/constants/enums';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto, iCreateBy: number): Promise<Material> {
    // Check if material code already exists
    const existingMaterial = await this.materialsRepository.findOne({
      where: { sMaterialCode: createMaterialDto.sMaterialCode },
    });

    if (existingMaterial) {
      throw new ConflictException('Material code already exists');
    }

    const material = this.materialsRepository.create({
      ...createMaterialDto,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy,
    });

    return this.materialsRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return this.materialsRepository.find({
      where: { iStatus: EntityStatus.ACTIVE },
    });
  }

  async findOne(iMaterialID: number): Promise<Material> {
    const material = await this.materialsRepository.findOne({
      where: { iMaterialID },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${iMaterialID} not found`);
    }

    return material;
  }

  async findByCode(sMaterialCode: string): Promise<Material> {
    const material = await this.materialsRepository.findOne({
      where: { sMaterialCode },
    });

    if (!material) {
      throw new NotFoundException(`Material with code ${sMaterialCode} not found`);
    }

    return material;
  }

  async update(iMaterialID: number, updateMaterialDto: UpdateMaterialDto, iUpdatedBy: number): Promise<Material> {
    const material = await this.findOne(iMaterialID);

    Object.assign(material, updateMaterialDto, { iUpdatedBy, dtUpdated: new Date() });

    return this.materialsRepository.save(material);
  }

  async remove(iMaterialID: number, iUpdatedBy: number): Promise<void> {
    const material = await this.findOne(iMaterialID);
    material.iStatus = EntityStatus.INACTIVE;
    material.iUpdatedBy = iUpdatedBy;
    material.dtUpdated = new Date();
    await this.materialsRepository.save(material);
  }
}