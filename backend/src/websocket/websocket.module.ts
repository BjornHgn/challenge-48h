import { Module } from '@nestjs/common';
import { StationGateway } from './station.gateway';

@Module({
  providers: [StationGateway],
  exports: [StationGateway],
})
export class WebsocketModule {}