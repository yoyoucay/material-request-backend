import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRequestDto {
  @ApiPropertyOptional({ example: 'Manufacturing', description: 'Department name' })
  @IsOptional()
  @IsString()
  sDept?: string;

  @ApiPropertyOptional({ example: 1, description: 'Status: 1 = ACTIVE, 0 = INACTIVE' })
  @IsOptional()
  iStatus?: number;
}