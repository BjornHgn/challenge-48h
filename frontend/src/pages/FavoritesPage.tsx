import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchFavoriteStations } from '../store/userSlice';
import { fetchStations } from '../store/stationsSlice';
import StationList from '../components/station/StationList';
import { useNavigate } from 'react-router-dom';
import { Station } from '../types/station';

const FavoritesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { favoriteStations, loading: favoritesLoading } = useSelector((state: RootState) => state.user);
  const { entities: stationEntities, loading: stationsLoading } = useSelector((state: RootState) => state.stations);

  useEffect(() => {
    dispatch(fetchFavoriteStations());
    dispatch(fetchStations());
  }, [dispatch]);

  const favoriteStationsList = Object.values(stationEntities)
    .filter((station): station is Station => 
      !!station && favoriteStations.includes(station._id)
    );

  const handleStationSelect = (station: Station) => {
    navigate(`/stations/${station._id}`);
  };

  const loading = favoritesLoading || stationsLoading;

  return (
    <div className="tbm-container">
      <h1 className="text-3xl font-bold mb-6">Mes stations favorites</h1>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Chargement de vos stations favorites...</p>
        </div>
      ) : favoriteStationsList.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <p className="text-lg text-gray-600 mb-4">Vous n'avez pas encore de stations favorites.</p>
          <p className="mb-4">Ajoutez des stations à vos favoris pour les retrouver rapidement.</p>
          <button
            onClick={() => navigate('/map')}
            className="tbm-btn tbm-btn-primary"
          >
            Explorer les stations
          </button>
        </div>
      ) : (
        <StationList
          stations={favoriteStationsList}
          onStationSelect={handleStationSelect}
        />
      )}
    </div>
  );
};

export default FavoritesPage;