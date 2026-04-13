import { IsString, IsInt, Min, Max, Length } from 'class-validator';

/**
 * Command: Contrato de entrada para CreateWarehouseUseCase
 */
export class CreateWarehouseCommandDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 200)
  location: string;

  @IsInt()
  @Min(1)
  @Max(1000000)
  capacity: number;

  constructor(name: string, location: string, capacity: number) {
    this.name = name;
    this.location = location;
    this.capacity = capacity;
  }
}
