import React from 'react'
export function Card({ className='', children }){ return <div className={`bg-white border border-slate-200 rounded-2xl ${className}`}>{children}</div> }
export function CardContent({ className='', children }){ return <div className={className}>{children}</div> }
