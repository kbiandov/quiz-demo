
import React from 'react'
export function Select({ children, value, onValueChange, disabled }){
  return <div data-disabled={disabled}>{React.Children.map(children, c=>React.cloneElement(c, {value, onValueChange, disabled}))}</div>
}
export function SelectTrigger({ children, className='' }){ return <div className={className}>{children}</div> }
export function SelectValue({ placeholder }){ return <span style={{opacity:0.6}}>{placeholder}</span> }
export function SelectContent({ children }){ return <div>{children}</div> }
export function SelectItem({ value, children, disabled, onValueChange }){
  return <div style={{padding:'6px 8px', border:'1px solid #eee', cursor: disabled?'not-allowed':'pointer', opacity: disabled?0.5:1}} onClick={()=>!disabled && onValueChange(value)}>{children}</div>
}
