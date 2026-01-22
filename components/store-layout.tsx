"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart-drawer";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export function StoreLayout({ children }: { children: React.ReactNode }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data } = await supabase
                .from("categories")
                .select("id, name, slug")
                .order("created_at", { ascending: true });

            if (data) {
                setCategories(data);
            }
        }
        fetchCategories();
    }, []);

    return (
        <>
            <Header
                onCartClick={() => setCartOpen(true)}
                categories={categories}
            />
            <main id="main-content">
                {children}
            </main>
            <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        </>
    );
}
