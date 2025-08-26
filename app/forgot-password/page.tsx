"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const { supabase } = useSupabase()
    const { toast } = useToast()

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`, // 👈 adjust path if needed
        })

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Email sent",
                description: "Check your inbox for the password reset link.",
            })
        }

        setLoading(false)
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
                <Headphones className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EnglishByEar</span>
            </Link>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Password forgotten</CardTitle>
                    <CardDescription>Enter your email to reset your password</CardDescription>
                </CardHeader>
                <form onSubmit={handleForgotPassword}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
