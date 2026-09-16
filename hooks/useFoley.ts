"use client";

import { useCallback } from "react";

export function useFoley() {
    // Sound effects disabled - returning no-op functions
    const playHover = useCallback(() => {
        // Sound disabled
    }, []);

    const playClick = useCallback(() => {
        // Sound disabled
    }, []);

    return { playHover, playClick };
}
