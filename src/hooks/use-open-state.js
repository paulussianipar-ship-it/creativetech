import { useCallback, useState } from 'react'

/** State terbuka/tutup sederhana untuk Dialog, ConfirmDialog, dsb. */
export function useOpenState(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), [])

  return {
    open,
    setOpen,
    onOpenChange: setOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  }
}