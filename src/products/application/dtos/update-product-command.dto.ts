import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';

/**
 * Command: Contrato de entrada para UpdateProductUseCase
 */
export class UpdateProductCommandDto {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  unit?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  constructor(
    name?: string,
    description?: string,
    unit?: string,
    minStockAlert?: number,
  ) {
    this.name = name;
    this.description = description;
    this.unit = unit;
    this.minStockAlert = minStockAlert;
  }
}
