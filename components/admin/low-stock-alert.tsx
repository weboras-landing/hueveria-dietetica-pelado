"use client";

import { StockItem } from "@/lib/stock";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertProps {
    items: StockItem[];
    threshold?: number;
}

export function LowStockAlert({ items, threshold = 10 }: LowStockAlertProps) {
    const lowStockItems = items.filter(
        (item) => item.currentStock > 0 && item.currentStock <= threshold
    );
    const outOfStockItems = items.filter((item) => item.currentStock === 0);

    if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Out of Stock Alert */}
            {outOfStockItems.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800 mb-2">
                                Productos Agotados ({outOfStockItems.length})
                            </h3>
                            <ul className="space-y-1">
                                {outOfStockItems.slice(0, 5).map((item) => (
                                    <li key={item.variantId} className="text-sm text-red-700">
                                        <span className="font-medium">{item.productName}</span>
                                        {" - "}
                                        <span className="text-red-600">{item.variantUnit}</span>
                                    </li>
                                ))}
                            </ul>
                            {outOfStockItems.length > 5 && (
                                <p className="text-sm text-red-600 mt-2">
                                    Y {outOfStockItems.length - 5} más...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                                Stock Bajo ({lowStockItems.length})
                            </h3>
                            <ul className="space-y-1">
                                {lowStockItems.slice(0, 5).map((item) => (
                                    <li key={item.variantId} className="text-sm text-yellow-700">
                                        <span className="font-medium">{item.productName}</span>
                                        {" - "}
                                        <span className="text-yellow-600">{item.variantUnit}</span>
                                        {" - "}
                                        <span className="font-semibold">
                                            {item.currentStock} unidades
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {lowStockItems.length > 5 && (
                                <p className="text-sm text-yellow-600 mt-2">
                                    Y {lowStockItems.length - 5} más...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
