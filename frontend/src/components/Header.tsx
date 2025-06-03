import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/stations" className="nav-link">Stations</Link>
          <Link to="/about" className="nav-link">À propos</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 