import { IsString, IsEmail, IsNumber, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../common/constants/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  sBadgeID: string;

  @IsString()
  @MinLength(3)
  sFullname: string;

  @IsEmail()
  sEmail: string;

  @IsEnum(UserRole)
  iRole: UserRole;

  @IsString()
  @MinLength(6)
  sPassword: string;
}