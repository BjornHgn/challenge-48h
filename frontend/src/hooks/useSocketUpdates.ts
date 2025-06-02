import { useState, useEffect } from 'react';
import socketService from '../services/socket';
import { Station } from '../types/station';

export const useSocketUpdates = (initialStation: Station): Station => {
  const [station, setStation] = useState<Station>(initialStation);
  
  useEffect(() => {
    // Update state if initialStation changes
    setStation(initialStation);
    
    // Subscribe to real-time updates
    const unsubscribe = socketService.subscribeToStation(
      initialStation._id,
      (updatedData) => {
        setStation((current) => ({ ...current, ...updatedData }));
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [initialStation._id]);
  
  return station;
};