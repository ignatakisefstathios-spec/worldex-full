import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// Global toast state
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export function addToast(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [{ ...toast, id }, ...toasts].slice(0, 5);
  notifyListeners();
  
  // Auto remove after 5 seconds
  setTimeout(() => removeToast(id), 5000);
}

export function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notifyListeners();
}

export function ToastContainer() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setLocalToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {localToasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl animate-in',
            getStyles(toast.type)
          )}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm">{toast.title}</p>
            {toast.message && (
              <p className="text-gray-400 text-xs mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
