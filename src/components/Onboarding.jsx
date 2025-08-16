import React, { useState } from "react";
import { normalizeId } from "../utils";

export default function Onboarding({ classes, onDone }){
  const [name,setName] = useState(""); const [classId,setClassId] = useState("");
  const canContinue = name.trim().length >= 2 && classId;
  const handleContinue = () => onDone({ name: name.trim(), classId });
  
  return (<div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Добре дошъл! 🎓</h1>
      <p className="text-slate-600 mb-6">Нека те опознаем, за да ти подберем правилните тестове.</p>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Име / прякор</label>
          <input 
            className="w-full rounded-lg border border-slate-300 px-3 py-2" 
            placeholder="напр. Алекс" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Клас</label>
          <select 
            className="w-full rounded-lg border border-slate-300 px-3 py-2" 
            value={classId} 
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Избери клас</option>
            {classes.map((c) => (
              <option key={normalizeId(c.id) || c.name} value={normalizeId(c.id) || c.name}>
                {c.name || c.title || c.class || c.id}
              </option>
            ))}
          </select>
        </div>
        <button 
         type="button" 
         className="btn w-full" 
         onClick={handleContinue} 
         disabled={!canContinue}
       >
         Продължи
       </button>
      </div>
      <p className="text-xs text-slate-500 mt-6">* Запазваме само име/прякор и клас на устройството ти.</p>
    </div></div>);
}