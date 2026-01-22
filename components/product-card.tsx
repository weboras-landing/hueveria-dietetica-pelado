"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";
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
    <div className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-tight">
          {product.name}
        </h3>

        {/* Variant selector */}
        <div className="mt-2">
          {product.variants && product.variants.length > 0 ? (
            <Select
              value={selectedVariantId}
              onValueChange={setSelectedVariantId}
            >
              <SelectTrigger className="w-full h-8 text-xs rounded-lg border-gray-200 bg-gray-50/50">
                <SelectValue placeholder="Seleccionar" />
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
            <p className="text-xs text-muted-foreground flex items-center h-8 px-1">
              {product.unit}
            </p>
          )}
        </div>

        {/* Price and add button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base sm:text-lg font-bold text-primary">
            {formatPrice(currentPrice)}
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            aria-label={`Agregar ${product.name} al carrito`}
            className="h-9 px-3 sm:px-4 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs font-semibold">Agregar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
