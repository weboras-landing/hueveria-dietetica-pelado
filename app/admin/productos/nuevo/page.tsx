import { requireAdmin } from "@/lib/auth";
import ProductForm from "@/components/admin/product-form";
import Link from "next/link";

export default async function NuevoProductoPage() {
    await requireAdmin();

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/productos"
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 mb-4"
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Volver a Productos
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Nuevo Producto
                </h1>
                <p className="text-gray-600">Crea un nuevo producto para la tienda</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <ProductForm />
            </div>
        </div>
    );
}
