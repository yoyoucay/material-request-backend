import { IsString, IsOptional } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  sDept?: string;

  @IsOptional()
  iStatus?: number;
}