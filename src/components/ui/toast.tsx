import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div
      className={cn(
        'flex items-center p-4 mb-2 rounded-md shadow-md transition-all transform animate-enter',
        type === 'success' && 'bg-green-100 border-l-4 border-green-500',
        type === 'error' && 'bg-red-100 border-l-4 border-red-500',
        type === 'info' && 'bg-blue-100 border-l-4 border-blue-500'
      )}
    >
      <div className="mr-3">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
        {type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
}; 