import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Debounce nilai (mis. kolom pencarian) supaya query tidak
 * dipicu setiap ketukan tombol.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/** Versi fungsi dengan debounce (untuk callback). */
export function useDebouncedCallback(callback, delay = 300) {
  const timerRef = useRef(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args) => {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => callbackRef.current(...args), delay)
    },
    [delay],
  )
}