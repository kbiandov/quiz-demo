import React, { useState } from "react";

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  
  const handleResetProfile = () => {
    if (window.confirm('Сигурни ли сте, че искате да нулирате профила? Това ще изтрие всички данни.')) {
      onResetProfile();
      onClose();
    }
  };

  const handleShowExplanationChange = (e) => setLocalSettings(s => ({...s, showExplanation: e.target.checked}));
  const handleShuffleQuestionsChange = (e) => setLocalSettings(s => ({...s, shuffleQuestions: e.target.checked}));
  const handleShuffleOptionsChange = (e) => setLocalSettings(s => ({...s, shuffleOptions: e.target.checked}));
  const handleInstantNextChange = (e) => setLocalSettings(s => ({...s, instantNext: e.target.checked}));
  const handleInstantDelayChange = (e) => setLocalSettings(s => ({...s, instantDelaySec: Number(e.target.value)}));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Настройки</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.showExplanation}
              onChange={handleShowExplanationChange} />
            <span>Показвай обяснения след отговор</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.shuffleQuestions}
              onChange={handleShuffleQuestionsChange} />
            <span>Разбърквай въпроси</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.shuffleOptions}
              onChange={handleShuffleOptionsChange} />
            <span>Разбърквай отговори</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.instantNext}
              onChange={handleInstantNextChange} />
            <span>Автоматично следващ въпрос</span>
          </label>

          {localSettings.instantNext && (
            <div className="pl-8">
              <label className="flex items-center gap-3">
                <span>Забавяне (секунди):</span>
                <input type="number" min="1" max="10" value={localSettings.instantDelaySec}
                  onChange={handleInstantDelayChange}
                  className="w-16 border rounded px-2 py-1" />
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" className="btn" onClick={onClose}>Отказ</button>
            <button type="button" className="btn btn-primary"
              onClick={handleSave}>Запази</button>
          </div>
        </div>
      </div>
    </div>
  );
}