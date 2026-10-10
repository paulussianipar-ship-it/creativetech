import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Panel deskripsi sederhana (mirip shadcn `Sheet`, tanpa dependensi tambahan).
 * Dipakai untuk sidebar admin pada layar kecil.
 */
const AdminSheet = React.forwardRef(({ open, onOpenChange, side = 'left', className, children, ...props }, ref) => (
  <div ref={ref} className={cn('fixed inset-0 z-50', className)} {...props}>
    {open && (
      <button
        type="button"
        aria-label="Tutup menu"
        onClick={() => onOpenChange?.(false)}
        className="absolute inset-0 animate-in fade-in-0 bg-slate-950/50 backdrop-blur-sm"
      />
    )}
    <div
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'absolute inset-y-0 w-72 bg-background shadow-xl transition-transform duration-200',
        side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
        open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full',
      )}
    >
      {children}
    </div>
  </div>
))
AdminSheet.displayName = 'AdminSheet'

export { AdminSheet }