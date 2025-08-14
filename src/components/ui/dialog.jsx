
import React from 'react'
export function Dialog({ open, onOpenChange, children }){
  if(!open) return null
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'grid', placeItems:'center', zIndex:50}} onClick={()=>onOpenChange(false)}>
    <div onClick={(e)=>e.stopPropagation()}>{children}</div>
  </div>
}
export function DialogContent({ children }){
  return <div style={{background:'#fff', borderRadius:12, padding:16, minWidth:320, maxWidth:560}}>{children}</div>
}
export function DialogHeader({ children }){ return <div style={{marginBottom:8}}>{children}</div> }
export function DialogTitle({ children }){ return <div style={{fontWeight:600, fontSize:18}}>{children}</div> }
export function DialogDescription({ children }){ return <div style={{fontSize:12, color:'#6b7280'}}>{children}</div> }
export function DialogFooter({ children }){ return <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>{children}</div> }
