import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SelectOption } from "@/types/setting"

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}

export function FormField({ id, label, hint, children }: FieldShellProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

type TextFieldProps = Omit<React.ComponentProps<typeof Input>, "id" | "onChange"> & {
  id: string
  label: string
  hint?: string
  onValueChange?: (value: string) => void
}

export function TextField({ id, label, hint, onValueChange, ...inputProps }: TextFieldProps) {
  return (
    <FormField id={id} label={label} hint={hint}>
      <Input id={id} onChange={onValueChange && ((e) => onValueChange(e.target.value))} {...inputProps} />
    </FormField>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  placeholder?: string
  hint?: string
}

export function SelectField({ id, label, value, options, onValueChange, placeholder, hint }: SelectFieldProps) {
  return (
    <FormField id={id} label={label} hint={hint}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}