import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class StationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(StationGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinStation')
  handleJoinStation(client: Socket, stationId: string) {
    client.join(`station:${stationId}`);
    this.logger.log(`Client ${client.id} joined station:${stationId}`);
  }

  @SubscribeMessage('leaveStation')
  handleLeaveStation(client: Socket, stationId: string) {
    client.leave(`station:${stationId}`);
    this.logger.log(`Client ${client.id} left station:${stationId}`);
  }

  @SubscribeMessage('joinFavorites')
  handleJoinFavorites(client: Socket, stationIds: string[]) {
    if (Array.isArray(stationIds)) {
      stationIds.forEach((id) => {
        client.join(`station:${id}`);
      });
      this.logger.log(`Client ${client.id} joined favorite stations`);
    }
  }

  notifyStationUpdate(station: any) {
    this.server.to(`station:${station._id}`).emit('stationUpdate', {
      _id: station._id,
      stationId: station.stationId,
      availableBikes: station.availableBikes,
      availableEBikes: station.availableEBikes,
      availableDocks: station.availableDocks,
      status: station.status,
      lastUpdated: station.lastUpdated,
    });
  }

  notifyBulkStationUpdate(stations: any[]) {
    stations.forEach((station) => {
      this.notifyStationUpdate(station);
    });

    // Also broadcast to general channel
    this.server.emit('allStationsUpdate', {
      count: stations.length,
      timestamp: new Date(),
    });
  }

  notifyStationStatusChange(stationId: string, status: string, previousStatus: string) {
    this.server.to(`station:${stationId}`).emit('stationStatusChange', {
      stationId,
      status,
      previousStatus,
      timestamp: new Date(),
    });
  }
}