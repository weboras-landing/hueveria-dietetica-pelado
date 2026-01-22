"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/store-layout";
import { Category, Product } from "@/lib/products";

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <StoreLayout>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al catalogo
              </Button>
            </Link>

            <div className="rounded-lg bg-primary px-6 py-4">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground italic">
                {category.name}
              </h1>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay productos en esta categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

        <footer className="border-t bg-card py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Hueveria y Dietetica El Pelado - Catalogo Virtual
            </p>
          </div>
        </footer>
      </StoreLayout>
    </div>
  );
}
