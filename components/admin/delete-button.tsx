"use client";

import { useState, useTransition } from "react";

interface DeleteButtonProps {
    id: string;
    action: (id: string) => Promise<void | { success: boolean; error?: string }>;
    itemName: string;
}

export default function DeleteButton({
    id,
    action,
    itemName,
}: DeleteButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await action(id);
                setShowConfirm(false);
            } catch (error) {
                alert(
                    error instanceof Error
                        ? error.message
                        : "Error al eliminar"
                );
            }
        });
    };

    if (showConfirm) {
        return (
            <div className="inline-flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                >
                    {isPending ? "Eliminando..." : "Confirmar"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                    Cancelar
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
            Eliminar
        </button>
    );
}
