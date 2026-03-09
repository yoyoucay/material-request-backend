import { IsString, IsEmail, IsNumber, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'EMP001', description: 'Unique badge ID for the employee' })
  @IsString()
  @MinLength(3)
  sBadgeID: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the employee' })
  @IsString()
  @MinLength(3)
  sFullname: string;

  @ApiProperty({ example: 'john.doe@company.com', description: 'Email address of the employee' })
  @IsEmail()
  sEmail: string;

  @ApiProperty({ example: 2, description: 'Role: 1 = ADMIN, 2 = EMPLOYEE', enum: UserRole })
  @IsEnum(UserRole)
  iRole: UserRole;

  @ApiProperty({ example: 'SecurePassword123', description: 'Password for the user (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  sPassword: string;
}