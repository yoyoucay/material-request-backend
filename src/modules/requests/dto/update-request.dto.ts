import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsDateString()
  requiredDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}