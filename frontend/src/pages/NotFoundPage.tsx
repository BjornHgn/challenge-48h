import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-400">404</h1>
        <p className="text-xl text-neutral-600 mb-4">Page not found</p>
        <Link to="/" className="text-primary-500 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;