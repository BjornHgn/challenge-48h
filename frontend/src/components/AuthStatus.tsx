import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/authSlice';

const AuthStatus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const { favoriteStations } = useSelector((state: RootState) => state.user);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow mb-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/30 rounded"></div>
            <div className="h-4 w-3/4 bg-white/30 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow mb-4">
      {isAuthenticated ? (
        <div>
          <p className="text-white font-medium">
            Connecté en tant que: <span className="font-bold">{user?.username}</span>
          </p>
          
          <div className="flex space-x-3 mt-2">
            <Link 
              to="/favorites" 
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm transition-colors"
            >
              Mes favoris ({favoriteStations?.length || 0})
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500/70 hover:bg-red-500 text-white rounded-md text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-white mb-2">Connectez-vous pour enregistrer vos stations favorites</p>
          <div className="flex space-x-2">
            <Link 
              to="/login" 
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm transition-colors"
            >
              Connexion
            </Link>
            <Link 
              to="/register" 
              className="px-3 py-1 bg-[#00b1eb] hover:bg-[#0090c0] text-white rounded-md text-sm transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;