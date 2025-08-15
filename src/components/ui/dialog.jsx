
import React from 'react'
export function Dialog({ open, onOpenChange, children }){
  if(!open) return null
  return <div className="fixed inset-0 bg-black/30 grid place-items-center z-50" onClick={()=>onOpenChange(false)}>
    <div onClick={(e)=>e.stopPropagation()}>{children}</div>
  </div>
}
export function DialogContent({ children }){
  return <div className="bg-white rounded-2xl p-4 min-w-[320px] max-w-[560px]">{children}</div>
}
export function DialogHeader({ children }){ return <div className="mb-2">{children}</div> }
export function DialogTitle({ children }){ return <div className="font-semibold text-lg">{children}</div> }
export function DialogDescription({ children }){ return <div className="text-xs text-slate-500">{children}</div> }
export function DialogFooter({ children }){ return <div className="flex justify-end gap-2 mt-3">{children}</div> }
