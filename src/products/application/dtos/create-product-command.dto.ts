import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';

/**
 * Command: Contrato de entrada para CreateProductUseCase
 */
export class CreateProductCommandDto {
  @IsString()
  @Length(4, 20)
  sku: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @Length(1, 50)
  unit: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  constructor(
    sku: string,
    name: string,
    unit: string,
    description?: string,
    minStockAlert?: number,
  ) {
    this.sku = sku;
    this.name = name;
    this.unit = unit;
    this.description = description;
    this.minStockAlert = minStockAlert ?? 0;
  }
}
