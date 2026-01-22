"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop: always visible, Mobile: sliding drawer */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <AdminSidebar closeMobile={() => setSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header with Hamburger */}
                <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
