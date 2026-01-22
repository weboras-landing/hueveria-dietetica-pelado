"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { SocialLinks } from "@/components/social-links";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  onCartClick: () => void;
  categories?: Category[];
}

export function Header({ onCartClick, categories = [] }: HeaderProps) {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, scroll to products section or navigate
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery]);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Ir al contenido principal
      </a>

      <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-2.5 group">
            <div className="relative w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/logo-mascot.png"
                alt="El Pelado"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif text-lg md:text-xl font-bold text-foreground tracking-tight">
              El Pelado
            </span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Social links - desktop only */}
            <div className="hidden lg:flex items-center mr-2">
              <SocialLinks iconSize="h-4 w-4" className="gap-2" />
            </div>

            {/* Search toggle removed */}

            {/* Cart button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all duration-200 hover:scale-105"
              onClick={onCartClick}
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[11px] font-semibold text-primary-foreground shadow-lg animate-cart-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-full ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search bar removed */}

        {/* Mobile menu - ONLY Social Links now */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-fade-in-up">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                <p className="py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                  Seguinos
                </p>
                <div className="flex justify-center">
                  <SocialLinks className="mt-2" />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
