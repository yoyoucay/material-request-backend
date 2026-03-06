import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../common/constants/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  sFullname?: string;

  @IsOptional()
  @IsEmail()
  sEmail?: string;

  @IsOptional()
  @IsEnum(UserRole)
  iRole?: UserRole;

  @IsOptional()
  iStatus?: number;
}