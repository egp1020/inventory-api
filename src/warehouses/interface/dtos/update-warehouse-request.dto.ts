import { IsString, IsInt, Min, Max, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP Request DTO
 * Valida y transforma entrada HTTP para UpdateWarehouseCommandDto
 */
export class UpdateWarehouseRequestDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Updated Warehouse Name',
    required: false,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Warehouse location',
    example: 'Barcelona, Spain',
    required: false,
  })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Maximum capacity in units',
    example: 10000,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  @IsOptional()
  capacity?: number;
}
