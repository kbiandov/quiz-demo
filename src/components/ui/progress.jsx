import React from 'react'
export function Progress({ value=0 }){
  return <div className="h-2 bg-slate-200 rounded-full"><div className="h-full rounded-full bg-blue-400" style={{width:`${value}%`}}/></div>
}
