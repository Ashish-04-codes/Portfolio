/**
 * Modal Component
 * Reusable modal dialog with newspaper styling
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title,
  children,
  size = 'md',
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-newsprint border-4 border-ink shadow-2xl w-full ${sizeStyles[size]} max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200`}>
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="border-b-2 border-ink p-4 flex items-center justify-between flex-shrink-0">
            {title && (
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-ink hover:text-newsprint transition-colors border border-transparent hover:border-ink"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
