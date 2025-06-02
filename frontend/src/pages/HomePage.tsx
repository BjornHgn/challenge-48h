import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 mb-4">
            VCub Station Tracker
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Find available bikes and docks at VCub stations across Bordeaux in real-time.
            Never miss a bike again!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/map"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              View Stations Map
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-white text-primary-500 border-2 border-primary-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📍
            </div>
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Real-time Location</h3>
            <p className="text-neutral-600">
              Find nearby VCub stations with live availability data updated every minute.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              ❤️
            </div>
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Save Favorites</h3>
            <p className="text-neutral-600">
              Mark your most used stations as favorites for quick access.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔔
            </div>
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Live Updates</h3>
            <p className="text-neutral-600">
              Get real-time notifications about bike availability at your favorite stations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;