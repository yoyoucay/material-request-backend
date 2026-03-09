import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/constants/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Full name of the employee' })
  @IsOptional()
  @IsString()
  sFullname?: string;

  @ApiPropertyOptional({ example: 'jane.doe@company.com', description: 'Email address of the employee' })
  @IsOptional()
  @IsEmail()
  sEmail?: string;

  @ApiPropertyOptional({ example: 1, description: 'Role: 1 = ADMIN, 2 = EMPLOYEE', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  iRole?: UserRole;

  @ApiPropertyOptional({ example: 1, description: 'Status: 1 = ACTIVE, 0 = INACTIVE' })
  @IsOptional()
  iStatus?: number;
}