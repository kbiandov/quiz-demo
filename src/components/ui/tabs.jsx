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
  return <button onClick={()=>ctx.setValue(value)} className={`px-3 py-2 border rounded-md mr-2 ${active?'bg-blue-50 border-blue-300':'bg-white border-slate-200'}`}>{children}</button>
}
export function TabsContent({ value, children, className='' }){
  const ctx = useContext(TabsCtx)
  if (ctx.value!==value) return null
  return <div className={className}>{children}</div>
}
