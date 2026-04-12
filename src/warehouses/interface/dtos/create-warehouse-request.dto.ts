import { IsString, IsInt, Min, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP Request DTO
 * Valida y transforma entrada HTTP para CreateWarehouseCommandDto
 */
export class CreateWarehouseRequestDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    description: 'Warehouse location',
    example: 'Madrid, Spain',
  })
  @IsString()
  @Length(1, 200)
  location!: string;

  @ApiProperty({
    description: 'Maximum capacity in units',
    example: 5000,
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  capacity!: number;
}
