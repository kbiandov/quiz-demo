
import React from 'react'
export function Button({ children, variant='default', size='md', className='', ...rest }){
  const bg = variant==='destructive' ? '#fee2e2' : (variant==='outline' ? '#fff' : '#e5e7eb')
  const border = variant==='outline' ? '1px solid #cbd5e1' : '1px solid #e5e7eb'
  const padding = size==='icon' ? '8px' : (size==='sm' ? '6px 10px' : '10px 14px')
  return <button className={className} style={{background:bg, border, borderRadius:8, padding}} {...rest}>{children}</button>
}
