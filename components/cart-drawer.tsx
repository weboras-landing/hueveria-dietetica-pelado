"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, X, Phone, MapPin } from "lucide-react";
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
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">("pickup");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  const handleSendWhatsApp = () => {
    if (!customerName.trim()) return;

    // Build additional info for WhatsApp message
    const additionalInfo = {
      phone: customerPhone,
      address: deliveryOption === "delivery" ? customerAddress : "",
      deliveryOption,
    };

    const url = getWhatsAppUrl(items, customerName, additionalInfo);
    window.open(url, "_blank");
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setDeliveryOption("pickup");
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
          <div className="flex flex-1 flex-col gap-4 py-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-foreground">
                  Tu nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="Ingresa tu nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-card text-foreground h-11"
                />
              </div>

              {/* Phone field (optional) */}
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono <span className="text-muted-foreground text-xs">(opcional)</span>
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="Ej: 351 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-card text-foreground h-11"
                />
              </div>

              {/* Delivery option */}
              <div className="space-y-2">
                <Label className="text-foreground">¿Cómo preferís recibir tu pedido?</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("pickup")}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${deliveryOption === "pickup"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-foreground hover:border-primary/30"
                      }`}
                  >
                    🏪 Retiro en local
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("delivery")}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${deliveryOption === "delivery"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-foreground hover:border-primary/30"
                      }`}
                  >
                    🚚 Envío a domicilio
                  </button>
                </div>
              </div>

              {/* Address field (shown only for delivery) */}
              {deliveryOption === "delivery" && (
                <div className="space-y-2 animate-fade-in-up">
                  <Label htmlFor="customerAddress" className="text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección de entrega
                  </Label>
                  <Input
                    id="customerAddress"
                    placeholder="Calle, número, barrio"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="bg-card text-foreground h-11"
                  />
                </div>
              )}

              {/* Order summary */}
              <div className="rounded-xl border bg-muted/50 p-4 mt-2">
                <h4 className="mb-3 font-semibold text-foreground">
                  Resumen del pedido
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex justify-between">
                      <span className="truncate flex-1 mr-2">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-2 pt-4">
              <Button
                className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-semibold"
                onClick={handleSendWhatsApp}
                disabled={!customerName.trim()}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar pedido por WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 bg-transparent rounded-xl"
                onClick={() => setShowCheckout(false)}
              >
                Volver al carrito
              </Button>
            </div>
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-lg font-medium">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground mt-1">¡Agregá productos para hacer tu pedido!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.product.id}
                        className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} / {item.product.unit}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent rounded-lg"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent rounded-lg"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
                  <Button
                    className="w-full h-12 rounded-xl font-semibold"
                    size="lg"
                    onClick={handleCheckout}
                  >
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
