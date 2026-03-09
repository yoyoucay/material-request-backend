import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { Request } from './entities/request.entity';
import { RequestDetail } from './entities/request-detail.entity';
import { EntityStatus } from '../common/constants/enums';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            addRequestDetail: jest.fn(),
            updateRequestDetail: jest.fn(),
            removeRequestDetail: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new request', async () => {
      const createDto = {
        sReqNumber: 'REQ001',
        sDept: 'Engineering',
        requestDetails: [
          {
            sMaterialCode: 'MAT001',
            decQty: 10,
          },
        ],
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockRequest);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto, 1);
      expect(result).toEqual(mockRequest);
    });
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      const requests = [mockRequest];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(requests);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(requests);
    });
  });

  describe('findOne', () => {
    it('should return a request by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockRequest);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRequest);
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const updateDto = {
        sDept: 'Updated Engineering',
      };

      const updatedRequest = { ...mockRequest, ...updateDto };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedRequest);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto, 1);
      expect(result).toEqual(updatedRequest);
    });
  });

  describe('addDetail', () => {
    it('should add a detail to a request', async () => {
      const createDetailDto = {
        sMaterialCode: 'MAT001',
        decQty: 10,
      };

      jest.spyOn(service, 'addRequestDetail').mockResolvedValueOnce(mockRequestDetail);

      const result = await controller.addDetail(1, createDetailDto);

      expect(service.addRequestDetail).toHaveBeenCalledWith(1, createDetailDto, 1);
      expect(result).toEqual(mockRequestDetail);
    });
  });

  describe('updateDetail', () => {
    it('should update a request detail', async () => {
      const updateDetailDto = {
        sMaterialCode: 'MAT002',
        decQty: 20,
      };

      const updatedDetail = { ...mockRequestDetail, ...updateDetailDto };

      jest.spyOn(service, 'updateRequestDetail').mockResolvedValueOnce(updatedDetail);

      const result = await controller.updateDetail(1, updateDetailDto);

      expect(service.updateRequestDetail).toHaveBeenCalledWith(1, updateDetailDto, 1);
      expect(result).toEqual(updatedDetail);
    });
  });

  describe('removeDetail', () => {
    it('should remove a request detail', async () => {
      jest.spyOn(service, 'removeRequestDetail').mockResolvedValueOnce(undefined);

      const result = await controller.removeDetail(1);

      expect(service.removeRequestDetail).toHaveBeenCalledWith(1, 1);
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a request', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toBeUndefined();
    });
  });
});
