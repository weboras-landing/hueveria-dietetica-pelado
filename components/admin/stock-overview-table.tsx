"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StockItem } from "@/lib/stock";
import { StockBadge } from "@/components/ui/stock-badge";
import { updateStockAction } from "@/app/admin/actions/stock-actions";
import { formatPrice } from "@/lib/products";
import Image from "next/image";
import { toast } from "sonner";

interface StockOverviewTableProps {
    items: StockItem[];
}

export function StockOverviewTable({ items }: StockOverviewTableProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [loading, setLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out">("all");
    const [optimisticStock, setOptimisticStock] = useState<Record<string, number>>({});

    const handleEdit = (item: StockItem) => {
        setEditingId(item.variantId);
        setEditValue(item.currentStock.toString());
    };

    const handleSave = async (variantId: string) => {
        const newStock = parseInt(editValue);
        if (isNaN(newStock) || newStock < 0) {
            toast.error("Por favor ingresa un número válido");
            return;
        }

        setLoading(variantId);

        // Optimistic update
        setOptimisticStock(prev => ({ ...prev, [variantId]: newStock }));
        setEditingId(null);

        const result = await updateStockAction(variantId, newStock);

        if (result.success) {
            toast.success("Stock actualizado correctamente");
            router.refresh();
        } else {
            toast.error(result.error || "Error al actualizar stock");
            // Revert optimistic update on error
            setOptimisticStock(prev => {
                const updated = { ...prev };
                delete updated[variantId];
                return updated;
            });
        }
        setLoading(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue("");
    };

    // Filter items
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "low" && item.currentStock > 0 && item.currentStock <= 10) ||
            (filterStatus === "out" && item.currentStock === 0);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Buscar producto o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="all">Todos</option>
                    <option value="low">Stock bajo</option>
                    <option value="out">Agotados</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variante
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.variantId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {item.productName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.categoryName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.variantUnit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatPrice(item.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === item.variantId ? (
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                                min="0"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-900">
                                                {optimisticStock[item.variantId] ?? item.currentStock}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StockBadge stock={optimisticStock[item.variantId] ?? item.currentStock} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {editingId === item.variantId ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSave(item.variantId)}
                                                    disabled={loading === item.variantId}
                                                    className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                                                >
                                                    {loading === item.variantId ? "..." : "Guardar"}
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={loading === item.variantId}
                                                    className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-primary hover:text-primary/80 font-medium"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron productos
                    </div>
                )}
            </div>
        </div>
    );
}
