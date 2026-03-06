import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRequestDetailDto } from './create-request-detail.dto';

export class CreateRequestDto {
  @IsString()
  sReqNumber: string;

  @IsString()
  sDept: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestDetailDto)
  requestDetails: CreateRequestDetailDto[];
}