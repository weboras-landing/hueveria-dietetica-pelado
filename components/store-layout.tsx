"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart-drawer";

export function StoreLayout({ children }: { children: React.ReactNode }) {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <>
            <Header onCartClick={() => setCartOpen(true)} />
            {children}
            <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        </>
    );
}
