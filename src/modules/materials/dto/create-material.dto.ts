import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MaterialStatus } from '../entities/material.entity';

export class CreateMaterialDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  unit: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus;
}