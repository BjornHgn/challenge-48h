import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StationDocument = Station & Document;

class Point {
  @Prop({ enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ required: true })
  coordinates: [number, number]; // [longitude, latitude]
}

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true, unique: true, index: true })
  stationId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ type: Point, required: true, index: '2dsphere' })
  location: Point;

  @Prop({ enum: ['OPEN', 'CLOSED', 'MAINTENANCE'], default: 'OPEN' })
  status: string;

  @Prop({ required: true, min: 0 })
  totalDocks: number;

  @Prop({ required: true, min: 0 })
  availableBikes: number;

  @Prop({ required: true, default: 0, min: 0 })
  availableEBikes: number;

  @Prop({ required: true, min: 0 })
  availableDocks: number;

  @Prop({ default: false })
  isEBikeStation: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const StationSchema = SchemaFactory.createForClass(Station);

// Virtual for calculating occupancy percentage
StationSchema.virtual('occupancyRate').get(function(this: StationDocument) {
  if (this.totalDocks === 0) return 0;
  return Math.round((this.availableBikes / this.totalDocks) * 100);
});