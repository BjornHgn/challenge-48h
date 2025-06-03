import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { login, register, logout, checkAuth } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (username: string, email: string, password: string) => 
      dispatch(register({ username, email, password })),
    logout: () => dispatch(logout()),
  };
};