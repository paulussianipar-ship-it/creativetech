import * as React from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const VARIANTS = {
  info: { wrapper: 'border-blue-200 bg-blue-50 text-blue-900', icon: Info, iconClass: 'text-blue-600' },
  warning: {
    wrapper: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: TriangleAlert,
    iconClass: 'text-amber-600',
  },
  destructive: {
    wrapper: 'border-red-200 bg-red-50 text-red-900',
    icon: AlertCircle,
    iconClass: 'text-red-600',
  },
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
  },
}

function Alert({ variant = 'info', title, description, icon: IconProp, className, children, ...props }) {
  const variantStyle = VARIANTS[variant] || VARIANTS.info
  const Icon = IconProp || variantStyle.icon

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-lg border p-3.5 text-sm', variantStyle.wrapper, className)}
      {...props}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', variantStyle.iconClass)} />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        {description && <p className="text-[13px] leading-relaxed opacity-90">{description}</p>}
        {children}
      </div>
    </div>
  )
}

export { Alert }