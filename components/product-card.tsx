"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { toast } from "sonner";
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
  const { addItem, items } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = product.variants?.find(
    (v) => v.id === selectedVariantId
  );

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;

  // Check if product is already in cart
  const cartItemId = selectedVariant ? selectedVariant.id : product.id;
  const cartItem = items.find((item) => item.product.id === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  // Check stock status (assuming all products are in stock for now, but ready for DB field)
  const inStock = true; // TODO: Add is_in_stock field to products table

  const handleAddToCart = () => {
    if (!inStock) return;

    setIsAdding(true);

    // Add to cart
    if (selectedVariant) {
      const variantProduct = {
        ...product,
        id: selectedVariant.id,
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        name: `${product.name} (${selectedVariant.unit})`,
      };
      addItem(variantProduct);
    } else {
      addItem(product);
    }

    // Show success state
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);

      // Show toast notification
      toast.success("¡Agregado al carrito!", {
        description: `${product.name} - ${currentUnit}`,
        duration: 2000,
      });

      // Reset success state after animation
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    }, 300);
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

        {/* Stock badge */}
        <div className="absolute top-2 left-2 z-10">
          {inStock ? (
            <span className="inline-flex items-center gap-1 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center bg-gray-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              Agotado
            </span>
          )}
        </div>

        {/* Quantity in cart badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
              <ShoppingBag className="w-3 h-3" />
              {quantityInCart}
            </span>
          </div>
        )}
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
              <SelectTrigger className="w-full h-9 text-sm rounded-lg border-gray-200 bg-gray-50/50">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id} className="text-sm">
                    {variant.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground flex items-center h-9 px-1">
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
            disabled={isAdding || justAdded || !inStock}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`h-9 px-3 sm:px-4 rounded-full shadow-md transition-all duration-300 ${!inStock
                ? "bg-gray-300 cursor-not-allowed"
                : justAdded
                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/30 scale-105"
                  : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-primary/20 hover:scale-105 active:scale-95"
              }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4 sm:mr-1 animate-in zoom-in duration-300" />
                <span className="hidden sm:inline text-xs font-semibold">¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className={`h-4 w-4 sm:mr-1 ${isAdding ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline text-xs font-semibold">
                  {quantityInCart > 0 ? "Agregar más" : "Agregar"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
