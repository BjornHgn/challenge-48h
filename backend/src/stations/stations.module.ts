import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { Station, StationSchema } from './schemas/station.schema';
import { WebsocketModule } from '../websocket/websocket.module';
import { UsersModule } from '../users/users.module'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
    WebsocketModule,
    UsersModule, // Add this line to import UsersModule
  ],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}