import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  sOldPassword: string;

  @IsString()
  @MinLength(6)
  sNewPassword: string;

  @IsString()
  @MinLength(6)
  sConfirmPassword: string;
}