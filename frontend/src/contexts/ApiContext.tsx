import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socket';
import { AppDispatch } from '../store';
import { checkAuth } from '../store/authSlice';

interface ApiContextValue {
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check auth on mount
    dispatch(checkAuth());
    
    // Connect socket
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const connectSocket = () => socketService.connect();
  const disconnectSocket = () => socketService.disconnect();

  return (
    <ApiContext.Provider value={{ connectSocket, disconnectSocket }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};