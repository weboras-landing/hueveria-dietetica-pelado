"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } =
    useCart();
  const [customerName, setCustomerName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  const handleSendWhatsApp = () => {
    if (!customerName.trim()) return;
    const url = getWhatsAppUrl(items, customerName);
    window.open(url, "_blank");
    clearCart();
    setCustomerName("");
    setShowCheckout(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {showCheckout ? "Finalizar Pedido" : "Tu Carrito"}
          </SheetTitle>
        </SheetHeader>

        {showCheckout ? (
          <div className="flex flex-1 flex-col gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-foreground">
                  Tu nombre
                </Label>
                <Input
                  id="customerName"
                  placeholder="Ingresa tu nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-card text-foreground"
                />
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-2 font-medium text-foreground">
                  Resumen del pedido:
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={item.product.id}>
                      {item.product.name} x{item.quantity} -{" "}
                      {formatPrice(item.product.price * item.quantity)}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t pt-3">
                  <p className="font-bold text-foreground">
                    Total: {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <Button
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                onClick={handleSendWhatsApp}
                disabled={!customerName.trim()}
              >
                Enviar pedido por WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setShowCheckout(false)}
              >
                Volver al carrito
              </Button>
            </div>
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Tu carrito esta vacio</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li
                        key={item.product.id}
                        className="flex items-center gap-4 rounded-lg border bg-card p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} / {item.product.unit}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-medium text-foreground">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Finalizar Pedido
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
