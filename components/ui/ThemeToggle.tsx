"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-lg bg-secondary border border-border" />
        )
    }

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative w-9 h-9 flex items-center justify-center rounded-lg bg-secondary border border-border hover:bg-secondary/80 hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
                <Moon size={18} className="text-secondary-foreground" />
            </div>

            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`}>
                <Sun size={18} className="text-yellow-600" />
            </div>
        </button>
    )
}
