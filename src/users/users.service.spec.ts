import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Password } from './entities/password.entity';
import { EntityStatus, UserRole } from '../common/constants/enums';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let passwordsRepository: Repository<Password>;

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

  const mockPassword: Password = {
    iPassID: 1,
    iUserID: 1,
    sPassword: 'hashedpassword123',
    iStatus: EntityStatus.ACTIVE,
    iCreateBy: 1,
    dtCreated: new Date(),
    iUpdatedBy: null,
    dtUpdated: null,
    user: mockUser,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Password),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    passwordsRepository = module.get<Repository<Password>>(getRepositoryToken(Password));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createDto = {
        sBadgeID: 'EMP001',
        sFullname: 'John Doe',
        sEmail: 'john@example.com',
        iRole: UserRole.EMPLOYEE,
        sPassword: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword123');
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'create').mockReturnValueOnce(mockPassword);
      jest.spyOn(passwordsRepository, 'save').mockResolvedValueOnce(mockPassword);

      const result = await service.create(createDto, 1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { sEmail: 'john@example.com' },
      });
      expect(usersRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = {
        sBadgeID: 'EMP001',
        sFullname: 'John Doe',
        sEmail: 'john@example.com',
        iRole: UserRole.EMPLOYEE,
        sPassword: 'password123',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);

      await expect(service.create(createDto, 1)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if badge ID already exists', async () => {
      const createDto = {
        sBadgeID: 'EMP001',
        sFullname: 'John Doe',
        sEmail: 'different@example.com',
        iRole: UserRole.EMPLOYEE,
        sPassword: 'password123',
      };

      jest.spyOn(usersRepository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(service.create(createDto, 1)).rejects.toThrow(ConflictException);
    });

    it('should set ACTIVE status when creating user', async () => {
      const createDto = {
        sBadgeID: 'EMP001',
        sFullname: 'John Doe',
        sEmail: 'john@example.com',
        iRole: UserRole.EMPLOYEE,
        sPassword: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword123');
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'create').mockReturnValueOnce(mockPassword);
      jest.spyOn(passwordsRepository, 'save').mockResolvedValueOnce(mockPassword);

      await service.create(createDto, 1);

      const createArg = (usersRepository.create as jest.Mock).mock.calls[0][0];
      expect(createArg.iStatus).toBe(EntityStatus.ACTIVE);
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([mockUser]);

      const result = await service.findAll();

      expect(usersRepository.find).toHaveBeenCalledWith({
        where: { iStatus: EntityStatus.ACTIVE },
      });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findOne(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { iUserID: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { sEmail: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = {
        sFullname: 'Jane Doe',
      };

      const updatedUser = { ...mockUser, sFullname: 'Jane Doe' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(updatedUser);

      const result = await service.update(1, updateDto, 2);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { iUserID: 1 },
      });
      expect(result.sFullname).toBe('Jane Doe');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(999, {}, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto = {
        sOldPassword: 'password123',
        sNewPassword: 'newpassword123',
        sConfirmPassword: 'newpassword123',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(mockPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('newhashedpassword123');
      jest.spyOn(passwordsRepository, 'create').mockReturnValueOnce(mockPassword);
      jest.spyOn(passwordsRepository, 'save').mockResolvedValueOnce(mockPassword);

      await service.changePassword(1, changePasswordDto, 1);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockPassword.sPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(passwordsRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      const changePasswordDto = {
        sOldPassword: 'wrongpassword',
        sNewPassword: 'newpassword123',
        sConfirmPassword: 'newpassword123',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(mockPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.changePassword(1, changePasswordDto, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password does not match confirm password', async () => {
      const changePasswordDto = {
        sOldPassword: 'password123',
        sNewPassword: 'newpassword123',
        sConfirmPassword: 'differentpassword',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(mockPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await expect(service.changePassword(1, changePasswordDto, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if password record not found', async () => {
      const changePasswordDto = {
        sOldPassword: 'password123',
        sNewPassword: 'newpassword123',
        sConfirmPassword: 'newpassword123',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.changePassword(1, changePasswordDto, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('should return user if password is valid', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(mockPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validatePassword('john@example.com', 'password123');

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { sEmail: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.validatePassword('nonexistent@example.com', 'password123')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if password is invalid', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(passwordsRepository, 'findOne').mockResolvedValueOnce(mockPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.validatePassword('john@example.com', 'wrongpassword')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce({ ...mockUser, iStatus: EntityStatus.INACTIVE });

      await service.remove(1, 2);

      const saveArg = (usersRepository.save as jest.Mock).mock.calls[0][0];
      expect(saveArg.iStatus).toBe(EntityStatus.INACTIVE);
      expect(saveArg.iUpdatedBy).toBe(2);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove(999, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
