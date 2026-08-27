"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealProps {
    children: ReactNode
    /** Delay in ms before the element animates in once visible */
    delay?: number
    className?: string
    /** Render as a different element if needed (defaults to div) */
    as?: "div" | "section" | "li"
}

export default function Reveal({
    children,
    delay = 0,
    className = "",
    as = "div",
}: RevealProps) {
    const ref = useRef<HTMLElement | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    const Tag = as as any

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "is-visible" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    )
}
