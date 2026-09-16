'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook for handling modal scroll
 * - Locks background scroll when modal is open
 * - Leaves wheel/touch input on the modal content native so nested scroll areas
 *   and smooth-scroll libraries do not fight for control
 * 
 * @param isOpen - Whether the modal is open
 * @param options - Configuration options
 * @returns contentRef - Ref to attach to the scrollable content container
 * 
 * @example
 * ```tsx
 * const contentRef = useModalScroll(isOpen);
 * 
 * return (
 *   <div ref={contentRef} className="overflow-y-auto">
 *     {content}
 *   </div>
 * );
 * ```
 */
export function useModalScroll(
    isOpen: boolean
): RefObject<HTMLDivElement | null> {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyPaddingRight = document.body.style.paddingRight;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.paddingRight = previousBodyPaddingRight;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [isOpen]);

    return contentRef;
}

export default useModalScroll;
