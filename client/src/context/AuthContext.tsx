import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { authService } from '../api/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  executeLogin: (credentials: LoginCredentials) => Promise<void>;
  executeRegister: (credentials: RegisterCredentials) => Promise<void>;
  executeLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Re-hydrate session state on initial application layout load
    const savedToken = localStorage.getItem('drive_auth_token');
    const savedUser = localStorage.getItem('drive_user_metadata');

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const executeLogin = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('drive_auth_token', data.token);
    localStorage.setItem('drive_user_metadata', JSON.stringify(data.user));
    setUser(data.user);
  };

  const executeRegister = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    localStorage.setItem('drive_auth_token', data.token);
    localStorage.setItem('drive_user_metadata', JSON.stringify(data.user));
    setUser(data.user);
  };

  const executeLogout = () => {
    localStorage.removeItem('drive_auth_token');
    localStorage.removeItem('drive_user_metadata');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, executeLogin, executeRegister, executeLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be mounted inside an AuthProvider wrapper component');
  return context;
};