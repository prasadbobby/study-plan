// client/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  resetPassword, 
  signInWithGoogle 
} from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      await loginWithEmail(email, password);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Register function
  const register = async (email, password, displayName) => {
    setError(null);
    try {
      await registerWithEmail(email, password, displayName);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Password reset function
  const resetUserPassword = async (email) => {
    setError(null);
    try {
      await resetPassword(email);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    register,
    logout,
    resetUserPassword,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}