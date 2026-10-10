import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Dropdown filter dengan sebuah "semua" pilihan + daftar pilihan.
 */
export default function FilterDropdown({
  label,
  value,
  onChange,
  options,
  allValue = 'all',
  className,
}) {
  const anchorRef = useRef(null)
  const widthRef = useRef(null)

  useEffect(() => {
    if (anchorRef.current) {
      widthRef.current = anchorRef.current?.offsetWidth
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} ref={anchorRef}>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{ minWidth: widthRef.current || 160 }}
        className="max-h-72"
      >
        <DropdownMenuRadioGroup
          value={value || allValue}
          onValueChange={(next) => onChange(next === allValue ? null : next)}
        >
          <DropdownMenuRadioItem value={allValue}>
            <span className="text-muted-foreground">Semua {label.toLowerCase()}</span>
          </DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}