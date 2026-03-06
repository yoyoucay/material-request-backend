import { IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailDto } from '../../material-details/dto/create-detail.dto';

export class CreateRequestDto {
  @IsString()
  sReqNumber: string;

  @IsString()
  sDept: string;

  @IsNumber()
  iCreateBy: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailDto)
  details: CreateDetailDto[];
}
