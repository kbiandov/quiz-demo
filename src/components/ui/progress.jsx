
import React from 'react'
export function Progress({ value=0 }){
  return <div style={{height:8, background:'#e5e7eb', borderRadius:9999}}><div style={{width:`${value}%`, height:'100%', background:'#60a5fa', borderRadius:9999}} /></div>
}
