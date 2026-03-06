import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Password } from './entities/password.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EntityStatus } from '../common/constants/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordsRepository: Repository<Password>,
  ) {}

  async create(createUserDto: CreateUserDto, iCreateBy: number): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { sEmail: createUserDto.sEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if badge ID already exists
    const existingBadge = await this.usersRepository.findOne({
      where: { sBadgeID: createUserDto.sBadgeID },
    });

    if (existingBadge) {
      throw new ConflictException('Badge ID already exists');
    }

    // Create user
    const user = this.usersRepository.create({
      sBadgeID: createUserDto.sBadgeID,
      sFullname: createUserDto.sFullname,
      sEmail: createUserDto.sEmail,
      iRole: createUserDto.iRole,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy,
    });

    const savedUser = await this.usersRepository.save(user);

    // Hash password and create password record
    const hashedPassword = await bcrypt.hash(createUserDto.sPassword, 10);
    const password = this.passwordsRepository.create({
      iUserID: savedUser.iUserID,
      sPassword: hashedPassword,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy,
    });

    await this.passwordsRepository.save(password);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { iStatus: EntityStatus.ACTIVE },
    });
  }

  async findOne(iUserID: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { iUserID },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${iUserID} not found`);
    }

    return user;
  }

  async findByEmail(sEmail: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { sEmail },
    });
  }

  async update(iUserID: number, updateUserDto: UpdateUserDto, iUpdatedBy: number): Promise<User> {
    const user = await this.findOne(iUserID);

    Object.assign(user, updateUserDto, { iUpdatedBy, dtUpdated: new Date() });

    return this.usersRepository.save(user);
  }

  async changePassword(
    iUserID: number,
    changePasswordDto: ChangePasswordDto,
    iUpdatedBy: number,
  ): Promise<void> {
    const user = await this.findOne(iUserID);

    // Get current password
    const currentPassword = await this.passwordsRepository.findOne({
      where: { iUserID },
      order: { dtCreated: 'DESC' },
    });

    if (!currentPassword) {
      throw new NotFoundException('Password record not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.sOldPassword, currentPassword.sPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Check if new password matches confirm password
    if (changePasswordDto.sNewPassword !== changePasswordDto.sConfirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.sNewPassword, 10);

    // Create new password record
    const newPassword = this.passwordsRepository.create({
      iUserID,
      sPassword: hashedPassword,
      iStatus: EntityStatus.ACTIVE,
      iCreateBy: iUpdatedBy,
    });

    await this.passwordsRepository.save(newPassword);
  }

  async validatePassword(sEmail: string, sPassword: string): Promise<User> {
    const user = await this.findByEmail(sEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const latestPassword = await this.passwordsRepository.findOne({
      where: { iUserID: user.iUserID },
      order: { dtCreated: 'DESC' },
    });

    if (!latestPassword) {
      throw new NotFoundException('Password record not found');
    }

    const isPasswordValid = await bcrypt.compare(sPassword, latestPassword.sPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async remove(iUserID: number, iUpdatedBy: number): Promise<void> {
    const user = await this.findOne(iUserID);
    user.iStatus = EntityStatus.INACTIVE;
    user.iUpdatedBy = iUpdatedBy;
    user.dtUpdated = new Date();
    await this.usersRepository.save(user);
  }
}