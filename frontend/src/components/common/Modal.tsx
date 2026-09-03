import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  drawerMode?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  drawerMode = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  }[maxWidth];

  if (drawerMode) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200" 
          onClick={onClose}
        />
        {/* Slide-in Drawer */}
        <div className="relative z-10 w-full max-w-md bg-white border-l border-zinc-200 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-zinc-900">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-zinc-200 bg-white">
            <div className="flex-1 min-w-0 pr-2">
              {typeof title === 'string' ? (
                <h2 className="text-sm sm:text-base font-heading font-bold text-zinc-950 tracking-tight">{title}</h2>
              ) : (
                title
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />
      {/* Modal Dialog */}
      <div className={`relative z-10 w-full ${maxWidthClasses} bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-zinc-900`}>
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-200 bg-white">
            <div className="flex-1 min-w-0 pr-2">
              {typeof title === 'string' ? (
                <h2 className="text-sm sm:text-base font-heading font-bold text-zinc-950 tracking-tight">{title}</h2>
              ) : (
                title
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-3.5 sm:p-6 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
