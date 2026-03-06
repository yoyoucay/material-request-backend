import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  sMaterialCode: string;

  @IsString()
  sMaterialName: string;

  @IsNumber()
  decUnitPrice: number;

  @IsOptional()
  @IsString()
  sDesc?: string;
}