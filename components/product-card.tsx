"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ""
  );

  const selectedVariant = product.variants?.find(
    (v) => v.id === selectedVariantId
  );

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;

  const handleAddToCart = () => {
    if (selectedVariant) {
      // Create a variant product to add to cart
      const variantProduct = {
        ...product,
        id: selectedVariant.id, // Use variant ID to distinguish in cart
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        name: `${product.name} (${selectedVariant.unit})`, // Optional: append unit to name for clarity in cart
      };
      addItem(variantProduct);
    } else {
      addItem(product);
    }
  };

  return (
    <div className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 h-12">
          {product.name}
        </h3>

        <div className="mt-2 h-10">
          {product.variants && product.variants.length > 0 ? (
            <Select
              value={selectedVariantId}
              onValueChange={setSelectedVariantId}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Seleccionar peso" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground flex items-center h-8">
              {product.unit}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {formatPrice(currentPrice)}
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            aria-label={`Agregar ${product.name} al carrito`}
            className="rounded-full px-4 bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-1 h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
