import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { register as registerUser } from '../../store/authSlice';
import '../../static/LoginRegister.css';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await dispatch(registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })).unwrap();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
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

        <button type="submit" className="login-button">
          Créer mon compte
        </button>
      </form>

      <p className="text-center mt-4">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="text-primary-500 hover:underline">
          Se connecter
        </Link>
      </p>

      <p className="privacy-notice">
        Les données personnelles sont recueillies pour le traitement de votre demande par TBM (exploité par Keolis Bordeaux Métropole Mobilités pour le compte de Bordeaux Métropole). Vous disposez d’un droit d’accès, de modification, de rectification, de limitation, d’opposition, de suppression des données vous concernant auprès de TBM, de réclamation auprès de la CNIL. Tous les détails du traitement de vos données personnelles et de vos droits sont disponibles à la rubrique « Politique de confidentialité » en pied de page du site infotbm.com.
      </p>
    </div>
  );
};

export default RegisterPage;
