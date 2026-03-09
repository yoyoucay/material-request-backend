import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { EntityStatus } from '../common/constants/enums';

describe('MaterialsController', () => {
  let controller: MaterialsController;
  let service: MaterialsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
      providers: [
        {
          provide: MaterialsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MaterialsController>(MaterialsController);
    service = module.get<MaterialsService>(MaterialsService);
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

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockMaterial);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto, 1);
      expect(result).toEqual(mockMaterial);
    });
  });

  describe('findAll', () => {
    it('should return all materials', async () => {
      const materials = [mockMaterial];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(materials);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(materials);
    });
  });

  describe('findOne', () => {
    it('should return a material by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockMaterial);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMaterial);
    });
  });

  describe('update', () => {
    it('should update a material', async () => {
      const updateDto = {
        sMaterialName: 'Updated Steel Rod',
      };

      const updatedMaterial = { ...mockMaterial, ...updateDto };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedMaterial);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto, 1);
      expect(result).toEqual(updatedMaterial);
    });
  });

  describe('remove', () => {
    it('should remove a material', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toBeUndefined();
    });
  });
});
