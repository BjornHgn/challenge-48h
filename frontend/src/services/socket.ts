import { io, Socket } from 'socket.io-client';
import { Station } from '../types/station';

class SocketService {
  private socket: Socket | null = null;
  private stationUpdateHandlers: Map<string, ((station: Partial<Station>) => void)[]> = new Map();
  
  connect() {
    if (!this.socket) {
      this.socket = io('/', {
        withCredentials: true,
        autoConnect: true,
      });
      
      this.setupListeners();
    }
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  private setupListeners() {
    if (!this.socket) return;
    
    this.socket.on('stationUpdate', (stationData: Partial<Station>) => {
      const stationId = stationData._id || stationData.stationId;
      if (!stationId) return;
      
      const handlers = this.stationUpdateHandlers.get(stationId);
      if (handlers) {
        handlers.forEach(handler => handler(stationData));
      }
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  subscribeToStation(stationId: string, callback: (station: Partial<Station>) => void) {
    if (!this.socket) {
      this.connect();
    }
    
    // Add the handler to our map
    if (!this.stationUpdateHandlers.has(stationId)) {
      this.stationUpdateHandlers.set(stationId, []);
    }
    this.stationUpdateHandlers.get(stationId)?.push(callback);
    
    // Join the station room
    this.socket?.emit('joinStation', stationId);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.stationUpdateHandlers.get(stationId);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
        
        if (handlers.length === 0) {
          this.socket?.emit('leaveStation', stationId);
          this.stationUpdateHandlers.delete(stationId);
        }
      }
    };
  }
  
  subscribeToFavorites(stationIds: string[]) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket?.emit('joinFavorites', stationIds);
  }
}

export default new SocketService();