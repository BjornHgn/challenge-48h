import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station, StationDocument } from './schemas/station.schema';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { BulkUpdateStationsDto } from './dto/bulk-update-stations.dto';
import { StationGateway } from '../websocket/station.gateway';
import { UsersService } from '../users/users.service';

@Injectable()
export class StationsService {
  constructor(
    @InjectModel(Station.name) private stationModel: Model<StationDocument>,
    private readonly stationGateway: StationGateway,
    private readonly usersService: UsersService,
  ) {}

  async findAll(filters: {
    status?: string;
    hasEBikes?: boolean;
    hasAvailableBikes?: boolean;
    hasAvailableDocks?: boolean;
    page: number;
    limit: number;
  }): Promise<{
    stations: Station[];
    pagination: { total: number; page: number; pages: number; limit: number };
  }> {
    const {
      status,
      hasEBikes,
      hasAvailableBikes,
      hasAvailableDocks,
      page,
      limit,
    } = filters;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (hasEBikes === true) {
      query.availableEBikes = { $gt: 0 };
    }

    if (hasAvailableBikes === true) {
      query.availableBikes = { $gt: 0 };
    }

    if (hasAvailableDocks === true) {
      query.availableDocks = { $gt: 0 };
    }

    const skip = (page - 1) * limit;

    const [stations, total] = await Promise.all([
      this.stationModel.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      this.stationModel.countDocuments(query),
    ]);

    return {
      stations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findById(id: string): Promise<Station> {
    const station = await this.stationModel.findById(id);

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    return station;
  }

  async findByStationId(stationId: string): Promise<Station> {
    const station = await this.stationModel.findOne({ stationId });

    if (!station) {
      throw new NotFoundException(`Station with stationId ${stationId} not found`);
    }

    return station;
  }

  async findNearby(
    longitude: number,
    latitude: number,
    distance = 1000,
  ): Promise<Station[]> {
    if (!longitude || !latitude) {
      throw new BadRequestException('Longitude and latitude are required');
    }

    return this.stationModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: distance,
        },
      },
    });
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    // Check if station with the same stationId already exists
    const existingStation = await this.stationModel.findOne({
      stationId: createStationDto.stationId,
    });

    if (existingStation) {
      throw new BadRequestException(
        `Station with stationId ${createStationDto.stationId} already exists`,
      );
    }

    const newStation = new this.stationModel(createStationDto);
    return newStation.save();
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    const station = await this.stationModel.findByIdAndUpdate(
      id,
      updateStationDto,
      { new: true, runValidators: true },
    );

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    // Notify clients about the update
    this.stationGateway.notifyStationUpdate(station);

    return station;
  }

  async bulkUpdate(
    bulkUpdateDto: BulkUpdateStationsDto,
  ): Promise<{ modified: number; total: number }> {
    const { stations } = bulkUpdateDto;

    if (!stations || !Array.isArray(stations) || stations.length === 0) {
      throw new BadRequestException('No stations provided for update');
    }

    const operations = stations.map((stationUpdate) => ({
      updateOne: {
        filter: { stationId: stationUpdate.stationId },
        update: {
          $set: {
            availableBikes: stationUpdate.availableBikes,
            availableEBikes: stationUpdate.availableEBikes || 0,
            availableDocks: stationUpdate.availableDocks,
            status: stationUpdate.status,
            lastUpdated: new Date(),
          },
        },
      },
    }));

    const result = await this.stationModel.bulkWrite(operations);

    // Fetch updated stations to broadcast
    const updatedStationIds = stations.map((station) => station.stationId);
    const updatedStations = await this.stationModel.find({
      stationId: { $in: updatedStationIds },
    });

    // Notify clients about updates
    this.stationGateway.notifyBulkStationUpdate(updatedStations);

    return {
      modified: result.modifiedCount,
      total: stations.length,
    };
  }

  async addToFavorites(userId: string, stationId: string): Promise<{ message: string }> {
    // Verify station exists
    await this.findById(stationId);
    
    // Add to user's favorites
    await this.usersService.addFavoriteStation(userId, stationId);
    
    return { message: 'Station added to favorites' };
  }

  async removeFromFavorites(userId: string, stationId: string): Promise<{ message: string }> {
    // Remove from user's favorites
    await this.usersService.removeFavoriteStation(userId, stationId);
    
    return { message: 'Station removed from favorites' };
  }

  async getFavoriteStations(userId: string): Promise<Station[]> {
    const favoriteIds = await this.usersService.getFavoriteStations(userId);
    
    if (!favoriteIds.length) {
      return [];
    }
    
    return this.stationModel.find({ _id: { $in: favoriteIds } });
  }
}