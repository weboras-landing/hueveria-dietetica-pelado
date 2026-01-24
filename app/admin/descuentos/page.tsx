import { requireAdmin } from "@/lib/auth";
import { getDiscounts } from "@/app/admin/actions/discounts";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { Tag, Calendar, Plus, Trash2, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/delete-button";
import { deleteDiscount } from "@/app/admin/actions/discounts";

export default async function DescuentosPage() {
    await requireAdmin();
    const discounts = await getDiscounts();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Descuentos
                    </h1>
                    <p className="text-gray-600">
                        Gestiona cupones y promociones
                    </p>
                </div>
                <Link
                    href="/admin/descuentos/nuevo"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Descuento
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Código / Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Uso
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Vigencia
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {discounts.map((discount: any) => (
                                <tr key={discount.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded inline-block text-xs mb-1">
                                                    {discount.code}
                                                </p>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {discount.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">
                                            {discount.type === 'percentage'
                                                ? `${discount.value}% OFF`
                                                : `$${discount.value} OFF`}
                                        </span>
                                        {discount.min_purchase > 0 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Min: {formatPrice(discount.min_purchase)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className="font-medium">{discount.current_uses}</span>
                                            <span className="text-gray-500">
                                                {discount.max_uses ? ` / ${discount.max_uses}` : ' usos'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${discount.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {discount.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {discount.expires_at ? (
                                                new Date(discount.expires_at).toLocaleDateString()
                                            ) : (
                                                <span className="text-gray-400">Sin expiración</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* TODO: Edit functionality */}
                                            {/* <button className="text-blue-600 hover:text-blue-800 p-1">
                                                <Edit className="w-4 h-4" />
                                            </button> */}
                                            <DeleteButton
                                                id={discount.id}
                                                action={deleteDiscount}
                                                itemName={discount.code}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {discounts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-400">
                                            <Tag className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">
                                                No hay descuentos activos
                                            </p>
                                            <Link
                                                href="/admin/descuentos/nuevo"
                                                className="text-primary hover:underline mt-2 inline-block"
                                            >
                                                Crear el primero
                                            </Link>
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
