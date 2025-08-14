
import React from 'react'
export function Card({ className='', children }){ return <div className={className} style={{border:'1px solid #e5e7eb', borderRadius:12, background:'#fff'}}>{children}</div> }
export function CardContent({ className='', children }){ return <div className={className}>{children}</div> }
