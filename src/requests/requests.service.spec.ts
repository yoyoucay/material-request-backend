import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { MaterialsService } from '../materials/materials.service';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';
import { EntityStatus } from '../common/constants/enums';

describe('RequestsService', () => {
  let service: RequestsService;
  let requestsRepository: Repository<Request>;
  let requestDetailsRepository: Repository<RequestDetail>;
  let materialsService: MaterialsService;

  const mockRequest: Request = {
    iRequestID: 1,
    sReqNumber: 'REQ001',
    sDept: 'Engineering',
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    requestDetails: [],
  };

  const mockRequestDetail: RequestDetail = {
    iDetailID: 1,
    iRequestID: 1,
    sMaterialCode: 'MAT001',
    decQty: 10,
    sDesc: 'Steel rod for project',
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    request: mockRequest,
    material: null,
  };

  const mockMaterial = {
    iMaterialID: 1,
    sMaterialCode: 'MAT001',
    sMaterialName: 'Steel Rod',
    decUnitPrice: 50.00,
    iStatus: EntityStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RequestDetail),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MaterialsService,
          useValue: {
            findByCode: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    requestsRepository = module.get<Repository<Request>>(getRepositoryToken(Request));
    requestDetailsRepository = module.get<Repository<RequestDetail>>(getRepositoryToken(RequestDetail));
    materialsService = module.get<MaterialsService>(MaterialsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new request with details', async () => {
      const createDto = {
        sReqNumber: 'REQ001',
        sDept: 'Engineering',
        requestDetails: [
          {
            sMaterialCode: 'MAT001',
            decQty: 10,
            sDesc: 'Steel rod for project',
          },
        ],
      };

      jest.spyOn(materialsService, 'findByCode').mockResolvedValueOnce(mockMaterial as never);
      jest.spyOn(requestsRepository, 'create').mockReturnValueOnce(mockRequest);
      jest.spyOn(requestsRepository, 'save').mockResolvedValueOnce(mockRequest);
      jest.spyOn(requestDetailsRepository, 'create').mockReturnValueOnce(mockRequestDetail);
      jest.spyOn(requestDetailsRepository, 'save').mockResolvedValueOnce(mockRequestDetail);
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce({ ...mockRequest, requestDetails: [mockRequestDetail] });

      const result = await service.create(createDto, 1);

      expect(materialsService.findByCode).toHaveBeenCalledWith('MAT001');
      expect(requestsRepository.create).toHaveBeenCalled();
      expect(requestsRepository.save).toHaveBeenCalled();
      expect(requestDetailsRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should validate all materials exist before creating request', async () => {
      const createDto = {
        sReqNumber: 'REQ001',
        sDept: 'Engineering',
        requestDetails: [
          { sMaterialCode: 'MAT001', decQty: 10 },
          { sMaterialCode: 'INVALID', decQty: 5 },
        ],
      };

      jest.spyOn(materialsService, 'findByCode')
        .mockResolvedValueOnce(mockMaterial as never)
        .mockRejectedValueOnce(new NotFoundException('Material not found'));

      await expect(service.create(createDto, 1)).rejects.toThrow(NotFoundException);
      expect(requestsRepository.create).not.toHaveBeenCalled();
    });

    it('should set ACTIVE status when creating request', async () => {
      const createDto = {
        sReqNumber: 'REQ001',
        sDept: 'Engineering',
        requestDetails: [
          { sMaterialCode: 'MAT001', decQty: 10 },
        ],
      };

      jest.spyOn(materialsService, 'findByCode').mockResolvedValueOnce(mockMaterial as never);
      jest.spyOn(requestsRepository, 'create').mockReturnValueOnce(mockRequest);
      jest.spyOn(requestsRepository, 'save').mockResolvedValueOnce(mockRequest);
      jest.spyOn(requestDetailsRepository, 'create').mockReturnValueOnce(mockRequestDetail);
      jest.spyOn(requestDetailsRepository, 'save').mockResolvedValueOnce(mockRequestDetail);
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce({ ...mockRequest, requestDetails: [mockRequestDetail] });

      await service.create(createDto, 1);

      const createArg = (requestsRepository.create as jest.Mock).mock.calls[0][0];
      expect(createArg.iStatus).toBe(EntityStatus.ACTIVE);
    });
  });

  describe('findAll', () => {
    it('should return all active requests with details', async () => {
      const requests = [{ ...mockRequest, requestDetails: [mockRequestDetail] }];

      jest.spyOn(requestsRepository, 'find').mockResolvedValueOnce(requests);

      const result = await service.findAll();

      expect(requestsRepository.find).toHaveBeenCalledWith({
        where: { iStatus: EntityStatus.ACTIVE },
        relations: ['requestDetails'],
      });
      expect(result).toEqual(requests);
    });
  });

  describe('findOne', () => {
    it('should return a request by ID with details', async () => {
      const requestWithDetails = { ...mockRequest, requestDetails: [mockRequestDetail] };

      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(requestWithDetails);

      const result = await service.findOne(1);

      expect(requestsRepository.findOne).toHaveBeenCalledWith({
        where: { iRequestID: 1 },
        relations: ['requestDetails'],
      });
      expect(result).toEqual(requestWithDetails);
    });

    it('should throw NotFoundException if request does not exist', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const updateDto = {
        sDept: 'Updated Engineering',
      };

      const updatedRequest = { ...mockRequest, ...updateDto };

      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(mockRequest);
      jest.spyOn(requestsRepository, 'save').mockResolvedValueOnce(updatedRequest);

      const result = await service.update(1, updateDto, 2);

      expect(requestsRepository.findOne).toHaveBeenCalled();
      expect(requestsRepository.save).toHaveBeenCalled();
      expect(result.sDept).toBe('Updated Engineering');
    });

    it('should throw NotFoundException if request does not exist', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(999, {}, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addRequestDetail', () => {
    it('should add a detail to an existing request', async () => {
      const createDetailDto = {
        sMaterialCode: 'MAT001',
        decQty: 10,
        sDesc: 'Steel rod',
      };

      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(mockRequest);
      jest.spyOn(materialsService, 'findByCode').mockResolvedValueOnce(mockMaterial as never);
      jest.spyOn(requestDetailsRepository, 'create').mockReturnValueOnce(mockRequestDetail);
      jest.spyOn(requestDetailsRepository, 'save').mockResolvedValueOnce(mockRequestDetail);

      const result = await service.addRequestDetail(1, createDetailDto, 1);

      expect(requestsRepository.findOne).toHaveBeenCalledWith({
        where: { iRequestID: 1 },
        relations: ['requestDetails'],
      });
      expect(materialsService.findByCode).toHaveBeenCalledWith('MAT001');
      expect(result).toEqual(mockRequestDetail);
    });

    it('should throw NotFoundException if request does not exist', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.addRequestDetail(999, { sMaterialCode: 'MAT001', decQty: 10 }, 1)
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate material exists before adding detail', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(mockRequest);
      jest.spyOn(materialsService, 'findByCode').mockRejectedValueOnce(new NotFoundException('Material not found'));

      await expect(
        service.addRequestDetail(1, { sMaterialCode: 'INVALID', decQty: 10 }, 1)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRequestDetail', () => {
    it('should update a request detail', async () => {
      const updateDetailDto = {
        sMaterialCode: 'MAT002',
        decQty: 20,
        sDesc: 'Updated description',
      };

      const updatedDetail = { ...mockRequestDetail, ...updateDetailDto };

      jest.spyOn(requestDetailsRepository, 'findOne').mockResolvedValueOnce(mockRequestDetail);
      jest.spyOn(materialsService, 'findByCode').mockResolvedValueOnce(mockMaterial as never);
      jest.spyOn(requestDetailsRepository, 'save').mockResolvedValueOnce(updatedDetail);

      const result = await service.updateRequestDetail(1, updateDetailDto, 2);

      expect(requestDetailsRepository.findOne).toHaveBeenCalledWith({
        where: { iDetailID: 1 },
      });
      expect(materialsService.findByCode).toHaveBeenCalledWith('MAT002');
      expect(result).toEqual(updatedDetail);
    });

    it('should throw NotFoundException if detail does not exist', async () => {
      jest.spyOn(requestDetailsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.updateRequestDetail(999, { sMaterialCode: 'MAT001', decQty: 10 }, 2)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeRequestDetail', () => {
    it('should soft delete a request detail', async () => {
      jest.spyOn(requestDetailsRepository, 'findOne').mockResolvedValueOnce(mockRequestDetail);
      jest.spyOn(requestDetailsRepository, 'save').mockResolvedValueOnce({
        ...mockRequestDetail,
        iStatus: EntityStatus.INACTIVE,
      });

      await service.removeRequestDetail(1, 2);

      const saveArg = (requestDetailsRepository.save as jest.Mock).mock.calls[0][0];
      expect(saveArg.iStatus).toBe(EntityStatus.INACTIVE);
      expect(saveArg.iUpdatedBy).toBe(2);
    });

    it('should throw NotFoundException if detail does not exist', async () => {
      jest.spyOn(requestDetailsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.removeRequestDetail(999, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a request', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(mockRequest);
      jest.spyOn(requestsRepository, 'save').mockResolvedValueOnce({
        ...mockRequest,
        iStatus: EntityStatus.INACTIVE,
      });

      await service.remove(1, 2);

      const saveArg = (requestsRepository.save as jest.Mock).mock.calls[0][0];
      expect(saveArg.iStatus).toBe(EntityStatus.INACTIVE);
      expect(saveArg.iUpdatedBy).toBe(2);
    });

    it('should throw NotFoundException if request does not exist', async () => {
      jest.spyOn(requestsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove(999, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
