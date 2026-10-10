import { Toaster as SonnerToaster } from 'sonner'

/**
 * Pembungkus Toaster agar tema otomatis mengikuti token Admin Panel.
 * `richColors` dipakai agar status sukses/gagal mudah dibedakan.
 */
export default function Toaster({ position = 'top-right', ...props }) {
  return (
    <SonnerToaster
      position={position}
      closeButton
      richColors
      duration={3200}
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border shadow-lg',
        },
      }}
      {...props}
    />
  )
}