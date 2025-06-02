import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">VCub Tracker</Link>
          <nav className="flex items-center space-x-4">
            <Link to="/map" className="hover:text-primary-200">Map</Link>
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="hover:text-primary-200">Favorites</Link>
                <Link to="/profile" className="hover:text-primary-200">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="hover:text-primary-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">Login</Link>
                <Link to="/register" className="bg-secondary-500 px-4 py-2 rounded-lg hover:bg-secondary-600">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-neutral-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 VCub Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;