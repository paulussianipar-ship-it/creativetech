import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gabungkan class Tailwind dengan penyelesaian konflik yang benar.
 * Dipakai seluruh komponen shadcn/ui.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}