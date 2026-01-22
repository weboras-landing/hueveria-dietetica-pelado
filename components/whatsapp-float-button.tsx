"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5491112345678"; // Cambiar por el número real

export function WhatsAppFloatButton() {
  const message = encodeURIComponent(
    "Hola, quiero hacer un pedido desde el catálogo web."
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </a>
  );
}
