import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRequestDetailDto {
  @IsString()
  sMaterialCode: string;

  @IsNumber()
  decQty: number;

  @IsOptional()
  @IsString()
  sDesc?: string;
}