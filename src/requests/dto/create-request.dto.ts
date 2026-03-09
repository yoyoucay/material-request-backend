import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRequestDetailDto } from './create-request-detail.dto';

export class CreateRequestDto {
  @ApiProperty({ example: 'REQ001', description: 'Unique request number' })
  @IsString()
  sReqNumber: string;

  @ApiProperty({ example: 'Engineering', description: 'Department requesting materials' })
  @IsString()
  sDept: string;

  @ApiProperty({
    type: [CreateRequestDetailDto],
    description: 'Array of request line items/details',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestDetailDto)
  requestDetails: CreateRequestDetailDto[];
}