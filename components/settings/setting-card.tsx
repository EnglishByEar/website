import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  contentClassName?: string
}

export function SettingsCard({
  title,
  description,
  children,
  footer,
  onSubmit,
  contentClassName = "space-y-4",
}: SettingsCardProps) {
  const body = (
    <>
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {onSubmit ? <form onSubmit={onSubmit}>{body}</form> : body}
    </Card>
  )
}