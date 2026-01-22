"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/store-layout";
import { Footer } from "@/components/footer";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { Category, Product } from "@/lib/products";

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <StoreLayout>
        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/#categorias" className="hover:text-foreground transition-colors">
              Categorías
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="mb-4 -ml-2 hover:bg-primary/5">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al catálogo
            </Button>
          </Link>

          {/* Category header with pills styling */}
          <div className="rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/95 px-5 py-4 md:px-6 md:py-5 mb-6 relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:16px_16px]" />
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground italic relative z-10">
              {category.name}
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-1 relative z-10">
              {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
              {searchQuery && "encontrados"}
            </p>
          </div>

          {/* Search and filters bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar en esta categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>

            {/* Filter toggle button - mobile */}
            <Button
              variant="outline"
              className="sm:hidden h-11 rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>

            {/* Sort dropdown - desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 cursor-pointer"
              >
                <option value="default">Por defecto</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>
          </div>

          {/* Mobile filters panel */}
          {showFilters && (
            <div className="sm:hidden bg-gray-50 rounded-xl p-4 mb-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Ordenar por</span>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "default", label: "Por defecto" },
                  { value: "price-asc", label: "Menor precio" },
                  { value: "price-desc", label: "Mayor precio" },
                  { value: "name-asc", label: "A - Z" },
                  { value: "name-desc", label: "Z - A" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setShowFilters(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${sortBy === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-white border border-gray-200 text-foreground hover:border-primary/30"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">
                No se encontraron productos
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Probá con otra búsqueda"
                  : "No hay productos en esta categoría."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

        <Footer />
        <WhatsAppFloatButton />
      </StoreLayout>
    </div>
  );
}
