import React from "react";

export default function HeaderBar({ title, profile, onHome, onLogout, onOpenSettings }){
  return (<div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
    <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button" className="btn" onClick={onHome}>🏠</button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">        
        <button type="button" className="btn" onClick={onLogout}>👤</button>
        <button type="button" className="btn" onClick={onOpenSettings} title="Настройки">⚙️</button>
      </div>
    </div>
  </div>);
}