// src/hooks/useToast.ts
import { useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string) => {
    return addToast({ message, type: 'success' });
  };

  const error = (message: string) => {
    return addToast({ message, type: 'error' });
  };

  const info = (message: string) => {
    return addToast({ message, type: 'info' });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  };
};