import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { BulkUpdateStationsDto } from './dto/bulk-update-stations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stations' })
  @ApiQuery({ name: 'status', required: false, enum: ['OPEN', 'CLOSED', 'MAINTENANCE'] })
  @ApiQuery({ name: 'hasEBikes', required: false, type: Boolean })
  @ApiQuery({ name: 'hasAvailableBikes', required: false, type: Boolean })
  @ApiQuery({ name: 'hasAvailableDocks', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of stations' })
  async getAllStations(
    @Query('status') status?: string,
    @Query('hasEBikes') hasEBikes?: boolean,
    @Query('hasAvailableBikes') hasAvailableBikes?: boolean,
    @Query('hasAvailableDocks') hasAvailableDocks?: boolean,
    @Query('page') page = 1,
    @Query('limit') limit = 100,
  ) {
    return this.stationsService.findAll({
      status,
      hasEBikes,
      hasAvailableBikes,
      hasAvailableDocks,
      page: +page,
      limit: +limit,
    });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get stations near a location' })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'distance', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of nearby stations' })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  async getNearbyStations(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('distance') distance = 1000,
  ) {
    return this.stationsService.findNearby(longitude, latitude, +distance);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a station by ID' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station found' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getStationById(@Param('id') id: string) {
    return this.stationsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new station' })
  @ApiResponse({ status: 201, description: 'Station created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createStation(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async updateStation(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return this.stationsService.update(id, updateStationDto);
  }

  @Post('bulk-update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update station data' })
  @ApiResponse({ status: 200, description: 'Stations updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async bulkUpdateStations(@Body() bulkUpdateDto: BulkUpdateStationsDto) {
    return this.stationsService.bulkUpdate(bulkUpdateDto);
  }

  @Post('favorites/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add station to favorites' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station added to favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async addToFavorites(@Param('id') stationId: string, @Req() req) {
    return this.stationsService.addToFavorites(req.user.id, stationId);
  }

  @Delete('favorites/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove station from favorites' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromFavorites(@Param('id') stationId: string, @Req() req) {
    return this.stationsService.removeFromFavorites(req.user.id, stationId);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get favorite stations' })
  @ApiResponse({ status: 200, description: 'List of favorite stations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFavoriteStations(@Req() req) {
    return this.stationsService.getFavoriteStations(req.user.id);
  }
}