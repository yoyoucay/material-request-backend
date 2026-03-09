import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { EntityStatus } from '../common/constants/enums';

describe('MaterialsService', () => {
  let service: MaterialsService;
  let repository: Repository<Material>;

  const mockMaterial: Material = {
    iMaterialID: 1,
    sMaterialCode: 'MAT001',
    sMaterialName: 'Steel Rod',
    decUnitPrice: 50.00,
    sDesc: 'High quality steel rod',
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    requestDetails: [],
  };

  const mockMaterial2: Material = {
    iMaterialID: 2,
    sMaterialCode: 'MAT002',
    sMaterialName: 'Aluminum Sheet',
    decUnitPrice: 75.50,
    sDesc: 'Lightweight aluminum',
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    requestDetails: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: getRepositoryToken(Material),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
    repository = module.get<Repository<Material>>(getRepositoryToken(Material));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new material', async () => {
      const createDto = {
        sMaterialCode: 'MAT001',
        sMaterialName: 'Steel Rod',
        decUnitPrice: 50.00,
        sDesc: 'High quality steel rod',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValueOnce(mockMaterial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockMaterial);

      const result = await service.create(createDto, 1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { sMaterialCode: 'MAT001' },
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockMaterial);
      expect(result).toEqual(mockMaterial);
    });

    it('should throw ConflictException if material code already exists', async () => {
      const createDto = {
        sMaterialCode: 'MAT001',
        sMaterialName: 'Steel Rod',
        decUnitPrice: 50.00,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);

      await expect(service.create(createDto, 1)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { sMaterialCode: 'MAT001' },
      });
    });

    it('should set ACTIVE status when creating material', async () => {
      const createDto = {
        sMaterialCode: 'MAT003',
        sMaterialName: 'Copper Wire',
        decUnitPrice: 100,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValueOnce(mockMaterial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockMaterial);

      await service.create(createDto, 1);

      const callArgs = (repository.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.iStatus).toBe(EntityStatus.ACTIVE);
      expect(callArgs.iCreateBy).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all active materials', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([mockMaterial, mockMaterial2]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { iStatus: EntityStatus.ACTIVE },
      });
      expect(result).toEqual([mockMaterial, mockMaterial2]);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no materials exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a material by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { iMaterialID: 1 },
      });
      expect(result).toEqual(mockMaterial);
    });

    it('should throw NotFoundException if material does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { iMaterialID: 999 },
      });
    });
  });

  describe('findByCode', () => {
    it('should return a material by code', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);

      const result = await service.findByCode('MAT001');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { sMaterialCode: 'MAT001' },
      });
      expect(result).toEqual(mockMaterial);
    });

    it('should throw NotFoundException if material code does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findByCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a material', async () => {
      const updateDto = {
        sMaterialName: 'Updated Steel Rod',
        decUnitPrice: 60.00,
      };

      const updatedMaterial = { ...mockMaterial, ...updateDto };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedMaterial);

      const result = await service.update(1, updateDto, 2);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { iMaterialID: 1 },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.sMaterialName).toBe('Updated Steel Rod');
      expect(result.decUnitPrice).toBe(60.00);
    });

    it('should throw NotFoundException if material does not exist', async () => {
      const updateDto = { sMaterialName: 'Updated' };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto, 2)).rejects.toThrow(NotFoundException);
    });

    it('should set update timestamp and iUpdatedBy', async () => {
      const updateDto = { sMaterialName: 'Updated' };
      const updatedMaterial = { ...mockMaterial, ...updateDto };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedMaterial);

      await service.update(1, updateDto, 2);

      const saveArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(saveArg.iUpdatedBy).toBe(2);
      expect(saveArg.dtUpdated).toBeInstanceOf(Date);
    });
  });

  describe('remove', () => {
    it('should soft delete a material', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockMaterial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({ ...mockMaterial, iStatus: EntityStatus.INACTIVE });

      await service.remove(1, 2);

      const saveArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(saveArg.iStatus).toBe(EntityStatus.INACTIVE);
      expect(saveArg.iUpdatedBy).toBe(2);
      expect(saveArg.dtUpdated).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if material does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove(999, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
