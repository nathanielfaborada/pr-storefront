import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, title?: string, duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: Toast = { id, type, title, message, duration };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title = 'Success', duration = 3500) => {
    showToast('success', message, title, duration);
  }, [showToast]);

  const error = useCallback((message: string, title = 'Error', duration = 4000) => {
    showToast('error', message, title, duration);
  }, [showToast]);

  const warning = useCallback((message: string, title = 'Attention', duration = 3500) => {
    showToast('warning', message, title, duration);
  }, [showToast]);

  const info = useCallback((message: string, title = 'Info', duration = 3500) => {
    showToast('info', message, title, duration);
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component with Streetwear FinTech Polish
const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
          error: <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
        };

        const borderThemes = {
          success: 'border-emerald-500/30 bg-zinc-950 text-white shadow-lg',
          error: 'border-red-500/30 bg-zinc-950 text-white shadow-lg',
          warning: 'border-amber-500/30 bg-zinc-950 text-white shadow-lg',
          info: 'border-blue-500/30 bg-zinc-950 text-white shadow-lg',
        };

        const titleColors = {
          success: 'text-emerald-400',
          error: 'text-red-400',
          warning: 'text-amber-400',
          info: 'text-blue-400',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-3.5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-top-3 fade-in shadow-2xl font-mono ${borderThemes[toast.type]}`}
          >
            {icons[toast.type]}

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className={`text-xs font-bold uppercase tracking-wider ${titleColors[toast.type]}`}>
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-zinc-300 leading-snug mt-0.5">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
