
import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginUser, registerUser, getCurrentUser, logout as logoutAction } from '@/store/authSlice';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: unknown) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
  const { isAuthenticated, user, loading, token } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 AuthContext: Initializing auth...');
      
      const storedToken = localStorage.getItem('token');
      console.log('💾 Token from localStorage:', storedToken ? 'Present' : 'Not found');
      
      if (storedToken && !isAuthenticated) {
        console.log('🔄 Token exists but not authenticated, fetching user...');
        
        try {
          const result = await dispatch(getCurrentUser()).unwrap();
          console.log('✅ User fetched successfully:', result);
        } catch (error: any) {
          console.error('❌ Failed to fetch user:', error);
          
          // If the token is invalid, remove it
          if (error.status === 401 || error.status === 403) {
            console.log('🚫 Token invalid, cleaning up...');
            localStorage.removeItem('token');
            dispatch(logoutAction());
          }
        }
      } else {
        console.log('🔓 No token found or already authenticated');
      }
      
      // Always set initialized to true after checking
      setIsInitialized(true);
      console.log('🎯 Auth initialization complete');
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email);
      await dispatch(loginUser({ email, password })).unwrap();
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      console.log('✅ Login successful');
      return true;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
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
      console.log('📝 Attempting registration...');
      await dispatch(registerUser(userData)).unwrap();
      toast({
        title: "Registration Successful",
        description: "Welcome to SalonPro!",
      });
      console.log('✅ Registration successful');
      return true;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
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
