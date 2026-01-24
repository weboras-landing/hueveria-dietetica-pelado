"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/admin/actions/orders";
import type { OrderStatus } from "@/lib/types";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OrderStatusSelectorProps {
    orderId: string;
    currentStatus: OrderStatus;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "⏳ Pendiente" },
    { value: "confirmed", label: "✓ Confirmado" },
    { value: "preparing", label: "👨‍🍳 En preparación" },
    { value: "ready", label: "📦 Listo" },
    { value: "delivered", label: "✅ Entregado" },
    { value: "cancelled", label: "❌ Cancelado" },
];

export function OrderStatusSelector({
    orderId,
    currentStatus,
}: OrderStatusSelectorProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        setIsUpdating(true);
        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
            toast.success("Estado actualizado correctamente");
        } else {
            toast.error(result.error || "Error al actualizar el estado");
        }

        setIsUpdating(false);
    };

    return (
        <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
        >
            <SelectTrigger className="w-[200px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
