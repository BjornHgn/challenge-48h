import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = '404 - Page non trouvée | VCub Tracker';
  }, []);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-illustration">
          {/* Enhanced bicycle animation */}
          <div className="not-found-scene">
            <div className="not-found-road"></div>
            <div className="not-found-bicycle">
              {/* Wheels */}
              <div className="bicycle-wheel bicycle-wheel-left">
                <div className="wheel-tire"></div>
                <div className="wheel-spokes"></div>
                <div className="wheel-hub"></div>
              </div>
              <div className="bicycle-wheel bicycle-wheel-right">
                <div className="wheel-tire"></div>
                <div className="wheel-spokes"></div>
                <div className="wheel-hub"></div>
              </div>
              
              {/* Frame */}
              <div className="bicycle-frame">
                <div className="frame-top-tube"></div>
                <div className="frame-down-tube"></div>
                <div className="frame-seat-tube"></div>
                <div className="frame-seat-stay"></div>
                <div className="frame-chain-stay"></div>
              </div>
              
              {/* Handlebar & Seat */}
              <div className="bicycle-handlebar">
                <div className="handlebar-stem"></div>
                <div className="handlebar-grip-left"></div>
                <div className="handlebar-grip-right"></div>
              </div>
              <div className="bicycle-seat"></div>
              
              {/* Pedals & Chain */}
              <div className="bicycle-crank">
                <div className="crank-arm"></div>
                <div className="crank-pedal"></div>
              </div>
              <div className="bicycle-chain"></div>
              
              {/* Shadow */}
              <div className="bicycle-shadow"></div>
            </div>
            
            {/* Number 404 as road signs */}
            <div className="road-sign road-sign-4-left">4</div>
            <div className="road-sign road-sign-0">0</div>
            <div className="road-sign road-sign-4-right">4</div>
          </div>
        </div>
        
        <h1 className="not-found-title">
          <span className="not-found-subtitle">Page non trouvée</span>
        </h1>
        
        <p className="not-found-message">
          La page que vous recherchez semble avoir roulé ailleurs.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="not-found-button not-found-button-primary">
            Retour à l'accueil
          </Link>
          <Link to="/map" className="not-found-button not-found-button-secondary">
            Voir la carte des stations
          </Link>
        </div>
        
        <div className="not-found-help">
          <h2 className="not-found-help-title">Liens utiles</h2>
          <div className="not-found-links">
            <Link to="/map" className="not-found-link">
              <svg className="not-found-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Carte des stations
            </Link>
            {window.history.length > 1 && (
              <button onClick={() => window.history.back()} className="not-found-link">
                <svg className="not-found-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Page précédente
              </button>
            )}
            <Link to="/login" className="not-found-link">
              <svg className="not-found-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;