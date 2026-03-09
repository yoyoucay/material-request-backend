import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({ example: 'MAT001', description: 'Unique material code' })
  @IsString()
  sMaterialCode: string;

  @ApiProperty({ example: 'Steel Rod', description: 'Material name' })
  @IsString()
  sMaterialName: string;

  @ApiProperty({ example: 50.00, description: 'Unit price of the material' })
  @IsNumber()
  decUnitPrice: number;

  @ApiPropertyOptional({ example: 'High quality steel rod', description: 'Material description' })
  @IsOptional()
  @IsString()
  sDesc?: string;
}