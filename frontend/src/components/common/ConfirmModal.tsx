import React from 'react';
import { Modal } from './Modal.tsx';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure you want to delete?',
  description = 'This action is permanent and cannot be undone.',
  itemName,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 font-mono text-zinc-950 p-1">
        
        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            {variant === 'danger' ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-extrabold text-base text-zinc-950 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Item Name Highlight (If Provided) */}
        {itemName && (
          <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200 text-xs font-bold text-zinc-900 truncate">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Target Item:</span>
            <span className="text-zinc-950">{itemName}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-bold transition-all text-xs active:scale-98 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`w-full sm:w-auto h-10 px-5 rounded-xl font-bold transition-all shadow-xs text-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-zinc-950 hover:bg-orange-600 text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default ConfirmModal;
