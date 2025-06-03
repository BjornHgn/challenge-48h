import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { register as registerUser } from '../store/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Validate password against backend requirements
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      return "Le mot de passe doit contenir au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).";
    }
    
    return null;
  };

  // Validate username against backend requirements
  const validateUsername = (username: string) => {
    if (username.length < 3 || username.length > 30) {
      return "Le nom d'utilisateur doit contenir entre 3 et 30 caractères.";
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate username
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })).unwrap();
      
      // Registration successful
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = typeof err === 'string' 
        ? err 
        : err.message || 'Erreur lors de la création du compte.';
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Créer mon compte TBM</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        {/* Email input */}
        <label htmlFor="email" className="form-label">Adresse mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="ex: johndoe@example.com"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />

        {/* Username input */}
        <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="ex: johndoe"
          value={formData.username}
          onChange={handleChange}
          className="form-input"
          required
        />

        {/* Password input */}
        <label htmlFor="password" className="form-label">Mot de passe</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
        />

        {/* Confirm password input */}
        <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
          required
        />
        <div className="text-xs text-gray-500 mt-1 mb-3">
          Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule,
          un chiffre et un caractère spécial (@$!%*?&).
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-center mt-4">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="text-primary-500 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;