import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store previous focus
      previousFocusRef.current = document.activeElement;
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={(() => {
          const baseClasses = "bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden";
          const sizeClass = sizeClasses[size];
          return `${baseClasses} ${sizeClass}`;
        })()}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Затвори модал"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
