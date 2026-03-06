import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MaterialStatus } from '../entities/material.entity';

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus;
}