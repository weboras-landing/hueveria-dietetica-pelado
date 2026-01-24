import { requireAdmin } from "@/lib/auth";
import { getCustomers, getCustomerStatistics } from "@/app/admin/actions/customers";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { User, ShoppingBag, Calendar, Star } from "lucide-react";

export default async function ClientesPage() {
    await requireAdmin();
    const [customers, stats] = await Promise.all([
        getCustomers(),
        getCustomerStatistics(),
    ]);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Clientes
                    </h1>
                    <p className="text-gray-600">
                        Gestiona la base de datos de clientes
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.totalCustomers}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Clientes Frecuentes</p>
                    <p className="text-2xl font-bold text-amber-600">
                        {stats.frequentCustomers}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Promedio Pedidos</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {stats.averageOrdersPerCustomer.toFixed(1)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Gasto Promedio</p>
                    <p className="text-2xl font-bold text-green-600">
                        {formatPrice(stats.averageSpentPerCustomer)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Pedidos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total Gastado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Último Pedido
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900">
                                                        {customer.name}
                                                    </p>
                                                    {customer.is_frequent && (
                                                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                                                            <Star className="w-3 h-3 fill-amber-500" /> PRO
                                                        </span>
                                                    )}
                                                </div>
                                                {customer.address && (
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {customer.address}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            {customer.phone && (
                                                <p className="text-gray-600">{customer.phone}</p>
                                            )}
                                            {customer.email ? (
                                                <p className="text-gray-500">{customer.email}</p>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Sin email</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">
                                                {customer.total_orders}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                            {formatPrice(customer.total_spent)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {customer.last_order_at ? (
                                                new Date(customer.last_order_at).toLocaleDateString()
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/clientes/${customer.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                                        >
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-400">
                                            <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">
                                                No hay clientes registrados
                                            </p>
                                            <p className="text-sm">
                                                Los clientes se crearán automáticamente con los pedidos
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
