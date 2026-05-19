import { axiosClient } from './axiosClient';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },
};