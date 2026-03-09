import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaterialDto {
  @ApiPropertyOptional({ example: 'Premium Steel Rod', description: 'Material name' })
  @IsOptional()
  @IsString()
  sMaterialName?: string;

  @ApiPropertyOptional({ example: 55.00, description: 'Unit price of the material' })
  @IsOptional()
  @IsNumber()
  decUnitPrice?: number;

  @ApiPropertyOptional({ example: 'High quality steel rod for construction', description: 'Material description' })
  @IsOptional()
  @IsString()
  sDesc?: string;

  @ApiPropertyOptional({ example: 1, description: 'Status: 1 = ACTIVE, 0 = INACTIVE' })
  @IsOptional()
  iStatus?: number;
}