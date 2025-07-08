
import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginUser, registerUser, getCurrentUser, logout as logoutAction } from '@/store/authSlice';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: unknown) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, token, role } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      console.log('Initializing auth - Token:', !!storedToken, 'Role:', storedRole);

      if (storedToken && !user) {
        try {
          console.log('Fetching current user...');
          const result = await dispatch(getCurrentUser()).unwrap();
          console.log('Current user fetched:', result);
        } catch (error: any) {
          console.log('Failed to fetch current user:', error);
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            dispatch(logoutAction());
          }
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, user]);

  // Log role changes for debugging
  useEffect(() => {
    console.log('Auth state changed - Role:', role, 'User:', user?.role);
  }, [role, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: unknown): Promise<boolean> => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      toast({
        title: "Registration Successful",
        description: "Welcome to SalonPro!",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
