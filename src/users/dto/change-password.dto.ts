import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123', description: 'Current password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  sOldPassword: string;

  @ApiProperty({ example: 'NewPassword456', description: 'New password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  sNewPassword: string;

  @ApiProperty({ example: 'NewPassword456', description: 'Confirm new password (must match sNewPassword)' })
  @IsString()
  @MinLength(6)
  sConfirmPassword: string;
}