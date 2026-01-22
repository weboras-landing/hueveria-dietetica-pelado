"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/images/logo-mascot.png"
              alt="El Pelado"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-xl font-bold text-foreground tracking-tight">
            El Pelado
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all duration-200 hover:scale-105"
          onClick={onCartClick}
          aria-label="Ver carrito"
        >
          <ShoppingCart className="h-5 w-5 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[11px] font-semibold text-primary-foreground shadow-lg animate-in zoom-in-50 duration-200">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
