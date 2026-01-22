"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.unit}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="mr-1 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
