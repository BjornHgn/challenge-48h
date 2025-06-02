import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userData: any): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string, includePassword = false): Promise<UserDocument> {
    const query = this.userModel.findOne({ email });
    
    if (includePassword) {
      query.select('+password');
    }
    
    return query.exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true },
    );
  }

  async updateLastLogin(userId: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true },
    );
  }

  async addFavoriteStation(userId: string, stationId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    
    if (!user.favoriteStations.includes(stationId)) {
      user.favoriteStations.push(stationId);
      await user.save();
    }
    
    return user;
  }

  async removeFavoriteStation(userId: string, stationId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    
    user.favoriteStations = user.favoriteStations.filter(
      id => id.toString() !== stationId,
    );
    
    await user.save();
    return user;
  }

  async getFavoriteStations(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    return user.favoriteStations;
  }
}