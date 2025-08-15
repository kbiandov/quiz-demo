
import React from 'react'
export function Select({ children, value, onValueChange, disabled }){
  return <div data-disabled={disabled}>{React.Children.map(children, c=>React.cloneElement(c, {value, onValueChange, disabled}))}</div>
}
export function SelectTrigger({ children, className='' }){ return <div className={`border border-slate-300 rounded-lg px-3 py-2 ${className}`}>{children}</div> }
export function SelectValue({ placeholder }){ return <span className="text-slate-500">{placeholder}</span> }
export function SelectContent({ children }){ return <div className="mt-1 space-y-1">{children}</div> }
export function SelectItem({ value, children, disabled, onValueChange }){
  return <div className={`px-3 py-2 border border-slate-200 rounded-lg cursor-pointer ${disabled?'opacity-50 pointer-events-none':''}`} onClick={()=>!disabled && onValueChange(value)}>{children}</div>
}
