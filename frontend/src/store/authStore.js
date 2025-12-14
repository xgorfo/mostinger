import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      register: async (email, username, password) => {
        try {
          const response = await api.post('/auth/register', {
            email,
            username,
            password,
          });
          return { success: true, data: response.data };
        } catch (error) {
          console.error('Registration error:', error);
          return {
            success: false,
            error: error.response?.data?.detail || 'Registration failed',
          };
        }
      },
      
      login: async (username, password) => {
        try {
          const response = await api.post('/auth/login', {
            username,
            password,
          });
          
          const { access_token, user } = response.data;
          localStorage.setItem('token', access_token);
          set({ user, token: access_token, isAuthenticated: true });
          
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          return {
            success: false,
            error: error.response?.data?.detail || 'Login failed',
          };
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);