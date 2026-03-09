import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { EntityStatus, UserRole } from '../common/constants/enums';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    iUserID: 1,
    sBadgeID: 'EMP001',
    sFullname: 'John Doe',
    sEmail: 'john@example.com',
    iRole: UserRole.EMPLOYEE,
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    passwords: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            changePassword: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto = {
        sBadgeID: 'EMP001',
        sFullname: 'John Doe',
        sEmail: 'john@example.com',
        iRole: UserRole.EMPLOYEE,
        sPassword: 'password123',
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockUser);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto, 1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = {
        sFullname: 'Jane Doe',
      };

      const updatedUser = { ...mockUser, sFullname: 'Jane Doe' };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto, 1);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const changePasswordDto = {
        sOldPassword: 'password123',
        sNewPassword: 'newpassword123',
        sConfirmPassword: 'newpassword123',
      };

      jest.spyOn(service, 'changePassword').mockResolvedValueOnce(undefined);

      const result = await controller.changePassword(1, changePasswordDto);

      expect(service.changePassword).toHaveBeenCalledWith(1, changePasswordDto, 1);
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toBeUndefined();
    });
  });
});
