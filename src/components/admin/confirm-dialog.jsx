import { useOpenState } from '@/hooks/use-open-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'

/**
 * Rencana dialog konfirmasi (terutama untuk aksi hapus).
 * `open` dikontrol dari luar via `openState` supaya pemakai bisa
 * mengatur sendiri kapan dialog muncul.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  loading = false,
  title = 'Anda yakin?',
  description = 'Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Batal',
  destructive = true,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault()
              onConfirm?.()
            }}
            className={buttonVariants({ variant: destructive ? 'destructive' : 'default' })}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** Pasangan `open` + `setOpen` untuk dipakai bersama ConfirmDialog. */
export { useOpenState as useConfirmState }