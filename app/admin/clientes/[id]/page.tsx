import { requireAdmin } from "@/lib/auth";
import { getCustomerById } from "@/app/admin/actions/customers";
import { formatPrice } from "@/lib/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    User, Phone, MapPin, Calendar, ShoppingBag,
    ArrowLeft, Mail, Star, ExternalLink, Edit
} from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    await requireAdmin();
    const customer = await getCustomerById(params.id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/clientes"
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {customer.name}
                            </h1>
                            {customer.is_frequent && (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-500" /> PRO
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Cliente desde {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                        <Edit className="w-4 h-4" />
                        Editar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Info & Stats */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Información
                        </h2>
                        <div className="space-y-4">
                            {customer.phone ? (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Teléfono</p>
                                        <p className="text-gray-600">{customer.phone}</p>
                                        <a
                                            href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <ExternalLink className="w-3 h-3" /> WhatsApp
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 italic">
                                    <Phone className="w-4 h-4" /> Sin teléfono
                                </div>
                            )}

                            {customer.email ? (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                        <p className="text-gray-600 truncate max-w-[200px]">{customer.email}</p>
                                        <a
                                            href={`mailto:${customer.email}`}
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <ExternalLink className="w-3 h-3" /> Enviar correo
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 italic">
                                    <Mail className="w-4 h-4" /> Sin email
                                </div>
                            )}

                            {customer.address ? (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Dirección</p>
                                        <p className="text-gray-600">{customer.address}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.address)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <ExternalLink className="w-3 h-3" /> Mapa
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 italic">
                                    <MapPin className="w-4 h-4" /> Sin dirección
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Estadísticas
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Gastado</p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatPrice(customer.total_spent)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pedidos</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {customer.total_orders}
                                </p>
                            </div>
                            <div className="col-span-2 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Última Compra</span>
                                <span className="font-medium text-gray-900">
                                    {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-3">Notas Internas</h2>
                        {customer.notes ? (
                            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic">
                                "{customer.notes}"
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No hay notas registradas para este cliente.</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Historial de Pedidos
                            </h2>
                        </div>

                        {customer.orders && customer.orders.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {customer.orders.map((order: any) => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-mono text-xs font-bold">
                                                    #{order.order_number.split('-').pop()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-gray-900">
                                                            {formatPrice(order.total)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-sm text-gray-600">
                                                            {order.items?.length || 0} productos
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                        <span className="mx-1">•</span>
                                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <OrderStatusBadge status={order.status} />
                                                <Link
                                                    href={`/admin/pedidos/${order.id}`}
                                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    Ver Detalle
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Este cliente aún no ha realizado pedidos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
