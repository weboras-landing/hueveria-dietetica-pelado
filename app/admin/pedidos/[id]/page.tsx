import { requireAdmin } from "@/lib/auth";
import { getOrderById } from "@/app/admin/actions/orders";
import { formatPrice } from "@/lib/products";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, MapPin, Phone, Calendar, Package, CreditCard, ArrowLeft } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    await requireAdmin();
    const order = await getOrderById(params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/pedidos"
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Pedido #{order.order_number.split('-').pop()}
                            </h1>
                            <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {order.order_number}
                            </span>
                        </div>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleString("es-AR", {
                                dateStyle: "long",
                                timeStyle: "short"
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <OrderStatusSelector
                        orderId={order.id}
                        currentStatus={order.status}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos
                            </h2>
                            <span className="text-sm text-gray-500">
                                {order.items?.length || 0} items
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.variant_name || "Unidad"} • {formatPrice(item.unit_price)} c/u
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatPrice(item.subtotal)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            x{item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-6 border-t border-gray-200">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span className="flex items-center gap-1">
                                            Descuento
                                            {order.discount_code && (
                                                <span className="bg-green-100 px-1.5 py-0.5 rounded text-xs font-mono">
                                                    {order.discount_code}
                                                </span>
                                            )}
                                        </span>
                                        <span>-{formatPrice(order.discount_amount)}</span>
                                    </div>
                                )}
                                {order.delivery_fee > 0 && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Envío</span>
                                        <span>{formatPrice(order.delivery_fee)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Notas del Pedido
                            </h3>
                            <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Customer & Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Cliente
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                    <Link
                                        href={`/admin/clientes/${order.customer_id}`}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Ver historial de cliente
                                    </Link>
                                </div>
                            </div>

                            {order.customer_phone && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">{order.customer_phone}</p>
                                        <a
                                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 1.936c-5.54 0-10.038 4.498-10.038 10.038 0 1.77.46 3.491 1.332 5.006l-1.416 5.174 5.293-1.388c1.46.796 3.12 1.216 4.829 1.216 5.54 0 10.038-4.498 10.038-10.038 0-5.54-4.498-10.038-10.038-10.038z" /></svg>
                                            Enviar WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}

                            {order.customer_address && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">{order.customer_address}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customer_address)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 hover:underline mt-1 block"
                                        >
                                            Ver en mapa
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Entrega
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm text-gray-600">Método</span>
                                <span className={`font-medium text-sm px-2 py-1 rounded-full ${order.delivery_option === 'delivery'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.delivery_option === 'delivery' ? '🚚 Envío a domicilio' : '🏪 Retiro en local'}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600">
                                {order.status === 'delivered' ? (
                                    <p className="flex items-center gap-2 text-green-600">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        Entregado el {new Date(order.delivered_at!).toLocaleDateString()}
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                        Pendiente de entrega
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info (Placeholder for now) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Pago
                        </h2>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                            Pago contra entrega (Efectivo/Transferencia)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
