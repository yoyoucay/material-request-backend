import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  sMaterialName?: string;

  @IsOptional()
  @IsNumber()
  decUnitPrice?: number;

  @IsOptional()
  @IsString()
  sDesc?: string;

  @IsOptional()
  iStatus?: number;
}