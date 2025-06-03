import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { stationUpdated } from '../store/stationsSlice';

class SocketService {
  private socket: Socket | null = null;
  private stationHandlers: Map<string, ((data: any) => void)[]> = new Map();
  
  connect() {
    if (this.socket?.connected) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://10.33.70.223:3000';
    
    this.socket = io(API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('accessToken')
      }
    });
    
    this.registerEvents();
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  private registerEvents() {
    if (!this.socket) return;
    
    // Handle station updates
    this.socket.on('stationUpdate', (data) => {
      // Dispatch to redux
      store.dispatch(stationUpdated({
        id: data._id,
        changes: data
      }));
      
      // Call any registered handlers for this station
      const stationId = data._id;
      if (this.stationHandlers.has(stationId)) {
        const handlers = this.stationHandlers.get(stationId);
        handlers?.forEach(handler => handler(data));
      }
    });
    
    // Handle connection events
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
  
  // Added this method for useSocketUpdates hook
  subscribeToStation(stationId: string, callback: (data: any) => void) {
    if (!this.stationHandlers.has(stationId)) {
      this.stationHandlers.set(stationId, []);
    }
    
    const handlers = this.stationHandlers.get(stationId);
    handlers?.push(callback);
    
    // Join the room for this station if socket is connected
    this.joinStationRoom(stationId);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.stationHandlers.get(stationId);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }
  
  // Join a station room to receive specific updates
  joinStationRoom(stationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('joinStation', stationId);
    }
  }
  
  // Leave a station room
  leaveStationRoom(stationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leaveStation', stationId);
    }
  }
  
  // Join favorite stations rooms
  joinFavoriteStations(stationIds: string[]) {
    if (this.socket?.connected) {
      this.socket.emit('joinFavorites', stationIds);
    }
  }
}

// Export as singleton
export const socketService = new SocketService();
export default socketService;