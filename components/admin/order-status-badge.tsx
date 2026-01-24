"use client";

import type { OrderStatus } from "@/lib/types";

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<
    OrderStatus,
    { label: string; className: string; icon: string }
> = {
    pending: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
    },
    confirmed: {
        label: "Confirmado",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "✓",
    },
    preparing: {
        label: "En preparación",
        className: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "👨‍🍳",
    },
    ready: {
        label: "Listo",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: "📦",
    },
    delivered: {
        label: "Entregado",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "✅",
    },
    cancelled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: "❌",
    },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
        >
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
}
