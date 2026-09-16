"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
    ({ className, onFocus, onBlur, icon, ...props }, ref) => {
        return (
            <div className="group relative w-full">
                {/* Single unified container with border */}
                <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 sm:py-3 bg-background border border-border rounded-xl transition-all duration-300 group-focus-within:border-yellow group-focus-within:ring-1 group-focus-within:ring-yellow/50">
                    {icon && (
                        <div className="flex-shrink-0 text-muted-foreground group-focus-within:text-yellow transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        onFocus={(e) => {
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            onBlur?.(e);
                        }}
                        className={`flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-xs sm:text-sm ${className || ""}`}
                        style={{
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                        }}
                    />
                </div>
            </div>
        );
    }
);

CyberInput.displayName = "CyberInput";
