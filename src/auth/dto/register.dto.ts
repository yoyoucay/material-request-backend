import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../../common/constants/enums';

export class RegisterDto {
  @ApiProperty({ example: 'EMP001' })
  @IsString()
  @MaxLength(50)
  sBadgeID: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sFullname: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  sEmail: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  iRole: UserRole;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  sPassword: string;
}