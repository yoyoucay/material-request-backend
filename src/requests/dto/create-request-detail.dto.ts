import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestDetailDto {
  @ApiProperty({ example: 'MAT001', description: 'Material code to be requested' })
  @IsString()
  sMaterialCode: string;

  @ApiProperty({ example: 10, description: 'Quantity of material requested' })
  @IsNumber()
  decQty: number;

  @ApiPropertyOptional({ example: 'For main structure', description: 'Description or notes for this request detail' })
  @IsOptional()
  @IsString()
  sDesc?: string;
}