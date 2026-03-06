import { IsString, IsNumber, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  requestedById: string;

  @IsUUID()
  materialId: string;

  @IsNumber()
  quantity: number;

  @IsDateString()
  requestDate: string;

  @IsDateString()
  requiredDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}