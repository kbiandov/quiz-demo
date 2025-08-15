import React from "react";

export default function SquareButton({ label, onClick, icon = "🔹" }) {
  return (
    <button type="button" onClick={onClick} className="square group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full">
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}