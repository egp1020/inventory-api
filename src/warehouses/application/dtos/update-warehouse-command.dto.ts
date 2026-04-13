import { IsString, IsInt, Min, Max, Length, IsOptional } from 'class-validator';

/**
 * Command: Contrato de entrada para UpdateWarehouseUseCase
 */
export class UpdateWarehouseCommandDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(1, 200)
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @Max(1000000)
  @IsOptional()
  capacity?: number;

  constructor(name?: string, location?: string, capacity?: number) {
    this.name = name;
    this.location = location;
    this.capacity = capacity;
  }
}
