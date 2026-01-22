import { requireAdmin } from "@/lib/auth";
import CategoryForm from "@/components/admin/category-form";
import Link from "next/link";

export default async function NuevaCategoriaPage() {
    await requireAdmin();

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/categorias"
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
                    Volver a Categorías
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Nueva Categoría
                </h1>
                <p className="text-gray-600">Crea una nueva categoría de productos</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <CategoryForm />
            </div>
        </div>
    );
}
