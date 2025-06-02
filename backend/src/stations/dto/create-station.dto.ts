import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ description: 'GeoJSON type (Point)', default: 'Point' })
  @IsString()
  @IsEnum(['Point'])
  type: string = 'Point';

  @ApiProperty({
    description: 'Coordinates [longitude, latitude]',
    example: [-0.57918, 44.837789],
  })
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateStationDto {
  @ApiProperty({
    description: 'Unique station identifier',
    example: 'VCUB_001',
  })
  @IsNotEmpty()
  @IsString()
  stationId: string;

  @ApiProperty({
    description: 'Station name',
    example: 'Pey Berland',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Station address',
    example: 'Place Pey Berland, 33000 Bordeaux',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Station location as GeoJSON Point',
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'Station status',
    enum: ['OPEN', 'CLOSED', 'MAINTENANCE'],
    default: 'OPEN',
  })
  @IsString()
  @IsEnum(['OPEN', 'CLOSED', 'MAINTENANCE'])
  status: string = 'OPEN';

  @ApiProperty({
    description: 'Total number of docks at the station',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalDocks: number;

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
    description: 'Whether the station supports e-bikes',
    example: true,
    default: false,
  })
  @IsBoolean()
  isEBikeStation: boolean = false;
}