
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthResponse {
  user: User;
  message?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to fetch current user to check if token is valid
      const currentUser = await apiClient.getCurrentUser();
      setIsAuthenticated(true);
      setUser(currentUser);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      
      // Type guard to check if response has user property
      if (response && typeof response === 'object' && 'user' in response) {
        const authResponse = response as AuthResponse;
        setIsAuthenticated(true);
        setUser(authResponse.user);
      } else {
        // If no user in response, fetch current user
        const currentUser = await apiClient.getCurrentUser();
        setIsAuthenticated(true);
        setUser(currentUser);
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiClient.register(userData);
      
      // Type guard to check if response has user property
      if (response && typeof response === 'object' && 'user' in response) {
        const authResponse = response as AuthResponse;
        setIsAuthenticated(true);
        setUser(authResponse.user);
      } else {
        // If no user in response, fetch current user
        const currentUser = await apiClient.getCurrentUser();
        setIsAuthenticated(true);
        setUser(currentUser);
      }
      
      toast({
        title: "Registration Successful",
        description: "Welcome to SalonPro!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Clear any stored user data
    localStorage.clear();
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
