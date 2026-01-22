"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        ),
    },
    {
        name: "Productos",
        href: "/admin/productos",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
            </svg>
        ),
    },
    {
        name: "Categorías",
        href: "/admin/categorias",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
            </svg>
        ),
    },
];

export default function AdminSidebar({ closeMobile }: { closeMobile?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/admin/login");
        router.refresh();
    };

    const handleNavClick = () => {
        if (closeMobile) closeMobile();
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <Link href="/admin" className="flex items-center gap-3" onClick={handleNavClick}>
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold">P</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">El Pelado</h2>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-amber-500 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
