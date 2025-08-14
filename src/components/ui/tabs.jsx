
import React, { createContext, useContext, useState } from 'react'
const TabsCtx = createContext(null)
export function Tabs({ defaultValue, children, className='' }){
  const [value,setValue] = useState(defaultValue)
  return <TabsCtx.Provider value={{value,setValue}}><div className={className}>{children}</div></TabsCtx.Provider>
}
export function TabsList({ children, className='' }){ return <div className={className}>{children}</div> }
export function TabsTrigger({ value, children }){
  const ctx = useContext(TabsCtx)
  const active = ctx.value===value
  return <button onClick={()=>ctx.setValue(value)} style={{padding:'6px 10px', border:'1px solid #ddd', marginRight:6, background: active?'#eef':'#fff'}}>{children}</button>
}
export function TabsContent({ value, children, className='' }){
  const ctx = useContext(TabsCtx)
  if (ctx.value!==value) return null
  return <div className={className}>{children}</div>
}
