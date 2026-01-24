"use client";

import { useEffect } from "react";

/**
 * Component to suppress hydration warnings for body className
 * This is needed because some client components (like modals, drawers)
 * may add classes to the body element dynamically
 */
export function BodyClassNameSuppressor() {
    useEffect(() => {
        // This component only exists to suppress hydration warnings
        // The actual body className is managed by the layout
    }, []);

    return null;
}
