import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class StationUpdateDto {
  @ApiProperty({
    description: 'Unique station identifier',
    example: 'VCUB_001',
  })
  @IsNotEmpty()
  @IsString()
  stationId: string;

  @ApiProperty({
    description: 'Number of available bikes',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  availableBikes: number;

  @ApiProperty({
    description: 'Number of available e-bikes',
    example: 3,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  availableEBikes: number = 0;

  @ApiProperty({
    description: 'Number of available docks',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  availableDocks: number;

  @ApiProperty({
    description: 'Station status',
    enum: ['OPEN', 'CLOSED', 'MAINTENANCE'],
    default: 'OPEN',
  })
  @IsString()
  @IsEnum(['OPEN', 'CLOSED', 'MAINTENANCE'])
  status: string = 'OPEN';
}

export class BulkUpdateStationsDto {
  @ApiProperty({
    description: 'Array of station updates',
    type: [StationUpdateDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StationUpdateDto)
  stations: StationUpdateDto[];
}