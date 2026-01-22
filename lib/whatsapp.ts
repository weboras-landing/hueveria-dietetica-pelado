import type { Product } from "./products";
import { formatPrice } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

// CAMBIA ESTE NUMERO POR TU NUMERO DE WHATSAPP
// Formato: codigo de pais + numero sin espacios ni guiones
// Ejemplo Argentina: 5491112345678
export const WHATSAPP_NUMBER = "5493516089206";

export function generateWhatsAppMessage(
  items: CartItem[],
  customerName: string
): string {
  const itemsList = items
    .map(
      (item) =>
        `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
    )
    .join("\n");

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const message = `*Nuevo Pedido - El Pelado*

*Cliente:* ${customerName}

*Productos:*
${itemsList}

*Total:* ${formatPrice(total)}

Gracias por tu pedido!`;

  return message;
}

export function getWhatsAppUrl(items: CartItem[], customerName: string): string {
  const message = generateWhatsAppMessage(items, customerName);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
