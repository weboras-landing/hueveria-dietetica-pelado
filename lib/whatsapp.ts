import type { Product } from "./products";
import { formatPrice } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdditionalOrderInfo {
  phone?: string;
  address?: string;
  deliveryOption?: "pickup" | "delivery";
}

// CAMBIA ESTE NUMERO POR TU NUMERO DE WHATSAPP
// Formato: codigo de pais + numero sin espacios ni guiones
// Ejemplo Argentina: 5491112345678
export const WHATSAPP_NUMBER = "5493516089206";

export function generateWhatsAppMessage(
  items: CartItem[],
  customerName: string,
  additionalInfo?: AdditionalOrderInfo
): string {
  const itemsList = items
    .map(
      (item) =>
        `• ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
    )
    .join("\n");

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let deliveryInfo = "";
  if (additionalInfo?.deliveryOption === "delivery" && additionalInfo.address) {
    deliveryInfo = `\n\n*Envío a domicilio:*\n${additionalInfo.address}`;
  } else {
    deliveryInfo = "\n\n*Retiro en local*";
  }

  let phoneInfo = "";
  if (additionalInfo?.phone) {
    phoneInfo = `\n*Teléfono:* ${additionalInfo.phone}`;
  }

  const message = `*Nuevo Pedido - El Pelado*

*Cliente:* ${customerName}${phoneInfo}

*Productos:*
${itemsList}

*Total:* ${formatPrice(total)}${deliveryInfo}

¡Gracias por tu pedido!`;

  return message;
}

export function getWhatsAppUrl(
  items: CartItem[],
  customerName: string,
  additionalInfo?: AdditionalOrderInfo
): string {
  const message = generateWhatsAppMessage(items, customerName, additionalInfo);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
