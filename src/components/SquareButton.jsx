import React from "react";

const SquareButton = ({ label, onClick, icon = "🔹" }) => {
  if (!onClick) {
    console.warn('SquareButton: onClick prop is required');
    return null;
  }

  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="square group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default SquareButton;