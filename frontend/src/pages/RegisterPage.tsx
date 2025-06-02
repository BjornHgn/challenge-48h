import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;