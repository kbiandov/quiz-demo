import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('by-lesson');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Тестове</h1>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={activeTab === 'by-lesson' ? 'px-3 py-2 bg-blue-500 text-white rounded' : 'px-3 py-2 bg-white border rounded'}
          onClick={() => setActiveTab('by-lesson')}
        >
          По тема / уроци
        </button>
        <button
          type="button"
          className={activeTab === 'by-class' ? 'px-3 py-2 bg-blue-500 text-white rounded' : 'px-3 py-2 bg-white border rounded'}
          onClick={() => setActiveTab('by-class')}
        >
          По класове
        </button>
      </div>
      {activeTab === 'by-lesson' && (
        <div className="p-4 bg-white border rounded">Съдържание за таб "По тема / уроци"</div>
      )}
      {activeTab === 'by-class' && (
        <div className="p-4 bg-white border rounded">Съдържание за таб "По класове"</div>
      )}
    </div>
  );
}
