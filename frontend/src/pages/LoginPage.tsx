import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';
import '../../static/LoginRegister.css';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (error) {
      // Error handled in reducer
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Connectez-vous avec<br />votre compte TBM !</h2>

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

        <div className="login-links">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
          <Link to="/register">Créer mon compte</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="privacy-notice">
        Les données personnelles sont recueillies pour le traitement de votre demande par TBM (exploité par Keolis Bordeaux Métropole Mobilités pour le compte de Bordeaux Métropole). Vous disposez d’un droit d’accès, de modification, de rectification, de limitation, d’opposition, de suppression des données vous concernant auprès de TBM, de réclamation auprès de la CNIL. Tous les détails du traitement de vos données personnelles et de vos droits sont disponibles à la rubrique « Politique de confidentialité » en pied de page du site infotbm.com.
      </p>
    </div>
  );
};

export default LoginPage;
