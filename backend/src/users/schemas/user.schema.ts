import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ select: false })
  refreshToken: string;

  @Prop({ type: [String], default: [] })
  favoriteStations: string[];

  @Prop({ type: String, default: null })
  homeStation: string;

  @Prop({ type: String, default: null })
  workStation: string;

  @Prop({ type: Date, default: null })
  lastLogin: Date;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);