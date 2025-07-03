import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toast } from '@/components/ui/toast';

interface ToastContextType {
  toast: ReturnType<typeof useToast>['toast'];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, toast, dismiss } = useToast();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 max-w-md w-full">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            {...toast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};