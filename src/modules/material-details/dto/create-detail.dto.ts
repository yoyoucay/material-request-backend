import { IsString, IsNumber } from 'class-validator';

export class CreateDetailDto {
  @IsString()
  sMaterialCode: string;

  @IsNumber()
  decQty: number;

  @IsString()
  sDesc: string;
}
