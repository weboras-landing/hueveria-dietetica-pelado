import { requireAdmin } from "@/lib/auth";
import { getStockOverview } from "@/lib/stock";
import { StockOverviewTable } from "@/components/admin/stock-overview-table";
import { LowStockAlert } from "@/components/admin/low-stock-alert";
import Link from "next/link";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
    await requireAdmin();

    const stockData = await getStockOverview();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Gestión de Inventario
                    </h1>
                    <p className="text-gray-600">
                        Administra el stock de todos tus productos
                    </p>
                </div>
                <Link
                    href="/admin/productos"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Ver Productos
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Productos
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stockData.totalProducts}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Variantes
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stockData.totalVariants}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Stock Bajo
                            </p>
                            <p className="text-3xl font-bold text-yellow-600">
                                {stockData.lowStockCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Agotados</p>
                            <p className="text-3xl font-bold text-red-600">
                                {stockData.outOfStockCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <LowStockAlert items={stockData.items} />

            {/* Stock Table */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Inventario Completo
                </h2>
                <StockOverviewTable items={stockData.items} />
            </div>
        </div>
    );
}
