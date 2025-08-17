import React, { useState, useEffect } from "react";

export default function ChangeUserConfirmModal({ isOpen, onClose, onConfirm }) {
  const [resetPointsChecked, setResetPointsChecked] = useState(false);

  // Reset checkbox when modal opens
  useEffect(() => {
    if (isOpen) {
      setResetPointsChecked(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(resetPointsChecked);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl max-w-md w-full shadow-2xl"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h2 
            id="modal-title"
            className="text-xl font-semibold text-slate-800"
          >
            Сигурни ли сте, че искате да смените потребителя?
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p 
            id="modal-description"
            className="text-slate-600 mb-4"
          >
            Ако продължите, ще отидете към страницата за смяна на потребител.
          </p>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={resetPointsChecked}
              onChange={(e) => setResetPointsChecked(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              aria-describedby="reset-points-description"
            />
            <span className="text-slate-700 font-medium">Нулирай точките</span>
          </label>
          
          <p 
            id="reset-points-description"
            className="text-sm text-slate-500 ml-6 mt-1"
          >
            Ако маркирате този чекбокс, точките на текущия потребител ще бъдат нулирани.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Отказване от смяна на потребителя"
          >
            Отказ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            aria-label="Потвърждение за смяна на потребителя"
          >
            Продължи
          </button>
        </div>
      </div>
    </div>
  );
}
