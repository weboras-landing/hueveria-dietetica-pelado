"use client";

import { toggleProductActive, toggleProductFeatured } from "@/app/admin/actions/products";
import { useTransition } from "react";

interface ToggleButtonProps {
    productId: string;
    isActive: boolean;
    type: "active" | "featured";
}

export default function ToggleButton({
    productId,
    isActive,
    type,
}: ToggleButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            if (type === "active") {
                await toggleProductActive(productId, isActive);
            } else {
                await toggleProductFeatured(productId, isActive);
            }
        });
    };

    if (type === "active") {
        return (
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } disabled:opacity-50`}
                title={isActive ? "Desactivar" : "Activar"}
            >
                {isPending ? "..." : isActive ? "Activo" : "Inactivo"}
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`inline-flex items-center gap-1 text-sm transition-opacity disabled:opacity-50`}
            title={isActive ? "Quitar destacado" : "Marcar como destacado"}
        >
            <svg
                className={`w-5 h-5 ${isActive ? "text-amber-500 fill-amber-500" : "text-gray-400"
                    }`}
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
        </button>
    );
}
