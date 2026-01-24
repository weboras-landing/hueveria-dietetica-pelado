import { requireAdmin } from "@/lib/auth";
import { getOrders, getOrderStatistics } from "@/app/admin/actions/orders";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";
import DeleteButton from "@/components/admin/delete-button";
import { deleteOrder } from "@/app/admin/actions/orders";

export default async function PedidosPage() {
    await requireAdmin();
    const [orders, todayStats, weekStats, monthStats] = await Promise.all([
        getOrders(),
        getOrderStatistics("today"),
        getOrderStatistics("week"),
        getOrderStatistics("month"),
    ]);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Pedidos
                    </h1>
                    <p className="text-gray-600">
                        Gestiona todos los pedidos de la tienda
                    </p>
                </div>
                <Link
                    href="/admin/pedidos/nuevo"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Nuevo Pedido
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {todayStats.totalOrders}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                        {formatPrice(todayStats.totalRevenue)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {weekStats.totalOrders}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                        {formatPrice(weekStats.totalRevenue)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Este Mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {monthStats.totalOrders}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                        {formatPrice(monthStats.totalRevenue)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {pendingOrders}
                    </p>
                    <p className="text-sm text-gray-500">Requieren atención</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Número
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Entrega
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/pedidos/${order.id}`}
                                            className="font-mono text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {order.customer_name}
                                            </p>
                                            {order.customer_phone && (
                                                <p className="text-sm text-gray-500">
                                                    {order.customer_phone}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {order.items?.length || 0} items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">
                                            {formatPrice(order.total)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.delivery_option === "delivery"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {order.delivery_option === "delivery"
                                                ? "🚚 Delivery"
                                                : "🏪 Retiro"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <OrderStatusSelector
                                            orderId={order.id}
                                            currentStatus={order.status}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleTimeString("es-AR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/pedidos/${order.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Ver
                                            </Link>
                                            <DeleteButton
                                                id={order.id}
                                                action={deleteOrder}
                                                itemName={order.order_number}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="text-gray-400">
                                            <svg
                                                className="mx-auto h-12 w-12 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="text-lg font-medium">
                                                No hay pedidos aún
                                            </p>
                                            <p className="text-sm">
                                                Los pedidos aparecerán aquí
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
