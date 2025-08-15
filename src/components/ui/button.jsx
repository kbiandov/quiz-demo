
import React from 'react'
export function Button({ children, variant='default', size='md', className='', ...rest }){
  const variants = {
    destructive: 'bg-red-50 border border-red-200 hover:bg-red-100',
    outline: 'bg-white border border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent hover:bg-slate-100',
    default: 'bg-slate-200 hover:bg-slate-300 border border-slate-300'
  }
  const sizes = { icon:'p-2', sm:'px-3 py-1.5', md:'px-4 py-2' }
  return <button className={`rounded-lg transition ${variants[variant]||variants.default} ${sizes[size]||sizes.md} ${className}`} {...rest}>{children}</button>
}
