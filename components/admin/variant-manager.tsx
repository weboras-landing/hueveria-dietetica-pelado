"use client";

import { useState } from "react";

interface Variant {
    id?: string;
    unit: string;
    price: number;
    stock: number;
    is_default: boolean;
}

interface VariantManagerProps {
    variants: Variant[];
    onChange: (variants: Variant[]) => void;
}

export default function VariantManager({
    variants,
    onChange,
}: VariantManagerProps) {
    const addVariant = () => {
        onChange([
            ...variants,
            { unit: "", price: 0, stock: 0, is_default: false },
        ]);
    };

    const removeVariant = (index: number) => {
        onChange(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };

        // If setting a new default, unset other defaults
        if (field === "is_default" && value === true) {
            updated.forEach((v, i) => {
                if (i !== index) v.is_default = false;
            });
        }

        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                    Variantes de Producto
                </label>
                <button
                    type="button"
                    onClick={addVariant}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Agregar Variante
                </button>
            </div>

            {variants.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                    No hay variantes. Agrega al menos una.
                </p>
            )}

            <div className="space-y-3">
                {variants.map((variant, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Unit */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Unidad
                                </label>
                                <input
                                    type="text"
                                    value={variant.unit}
                                    onChange={(e) =>
                                        updateVariant(index, "unit", e.target.value)
                                    }
                                    placeholder="Ej: 250g"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Precio ($)
                                </label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) =>
                                        updateVariant(index, "price", Number(e.target.value))
                                    }
                                    placeholder="3500"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) =>
                                        updateVariant(index, "stock", Number(e.target.value))
                                    }
                                    placeholder="0"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            {/* Default */}
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={variant.is_default}
                                        onChange={(e) =>
                                            updateVariant(index, "is_default", e.target.checked)
                                        }
                                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-xs font-medium text-gray-600">
                                        Por defecto
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="shrink-0 text-red-600 hover:text-red-800"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {variants.length > 0 && !variants.some((v) => v.is_default) && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Ninguna variante está marcada como predeterminada
                </p>
            )}
        </div>
    );
}
