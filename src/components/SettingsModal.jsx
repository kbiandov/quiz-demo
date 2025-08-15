import React, { useState } from "react";

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Настройки</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.showExplanation}
              onChange={(e) => setLocalSettings(s => ({...s, showExplanation: e.target.checked}))} />
            <span>Показвай обяснения след отговор</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.shuffleQuestions}
              onChange={(e) => setLocalSettings(s => ({...s, shuffleQuestions: e.target.checked}))} />
            <span>Разбърквай въпроси</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.shuffleOptions}
              onChange={(e) => setLocalSettings(s => ({...s, shuffleOptions: e.target.checked}))} />
            <span>Разбърквай отговори</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={localSettings.instantNext}
              onChange={(e) => setLocalSettings(s => ({...s, instantNext: e.target.checked}))} />
            <span>Автоматично следващ въпрос</span>
          </label>

          {localSettings.instantNext && (
            <div className="pl-8">
              <label className="flex items-center gap-3">
                <span>Забавяне (секунди):</span>
                <input type="number" min="1" max="10" value={localSettings.instantDelaySec}
                  onChange={(e) => setLocalSettings(s => ({...s, instantDelaySec: Number(e.target.value)}))}
                  className="w-16 border rounded px-2 py-1" />
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" className="btn" onClick={onClose}>Отказ</button>
            <button type="button" className="btn btn-primary"
              onClick={() => { onSave(localSettings); onClose(); }}>Запази</button>
          </div>
        </div>
      </div>
    </div>
  );
}