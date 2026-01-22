import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

async function getStats() {
    const supabase = await createClient();

    const [
        { count: totalProducts },
        { count: totalCategories },
        { count: activeProducts },
        { count: featuredProducts },
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true),
        supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("is_featured", true),
    ]);

    return {
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        activeProducts: activeProducts || 0,
        featuredProducts: featuredProducts || 0,
    };
}

export default async function AdminDashboard() {
    await requireAdmin();
    const stats = await getStats();

    const statCards = [
        {
            title: "Total Productos",
            value: stats.totalProducts,
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
            color: "bg-blue-500",
            link: "/admin/productos",
        },
        {
            title: "Categorías",
            value: stats.totalCategories,
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                </svg>
            ),
            color: "bg-purple-500",
            link: "/admin/categorias",
        },
        {
            title: "Productos Activos",
            value: stats.activeProducts,
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            color: "bg-green-500",
            link: "/admin/productos",
        },
        {
            title: "Productos Destacados",
            value: stats.featuredProducts,
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            ),
            color: "bg-amber-500",
            link: "/admin/productos",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">
                    Bienvenido al panel de administración
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.link}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium mb-1">
                                {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/admin/productos/nuevo"
                        className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors group"
                    >
                        <div className="bg-amber-500 text-white p-2 rounded-lg group-hover:bg-amber-600 transition-colors">
                            <svg
                                className="w-6 h-6"
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
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Nuevo Producto</p>
                            <p className="text-sm text-gray-600">
                                Agregar un producto a la tienda
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/categorias/nueva"
                        className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                    >
                        <div className="bg-purple-500 text-white p-2 rounded-lg group-hover:bg-purple-600 transition-colors">
                            <svg
                                className="w-6 h-6"
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
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Nueva Categoría</p>
                            <p className="text-sm text-gray-600">
                                Crear una nueva categoría
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
