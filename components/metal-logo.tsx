"use client";
import React from 'react'

export default function MetalLogo({ width = 50, height = 50, classChild = '' }: { width?: number; height?: number; classChild?: string }) {
    return (
        <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="w-64 h-auto object-contain"
    >
      <source src="/logo-metal-loop.webm" type="video/webm" />
    </video>
    )
}
