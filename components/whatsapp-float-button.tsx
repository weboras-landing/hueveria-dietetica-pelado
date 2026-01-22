"use client";

import Image from "next/image";

const WHATSAPP_NUMBER = "5493516089206";

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
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl ring-2 ring-[#25D366]/20 md:bottom-6 md:right-6"
      aria-label="Contactar por WhatsApp"
    >
      <Image
        src="/images/whatsapp-logo.png"
        alt="WhatsApp"
        width={56}
        height={56}
        className="rounded-full"
      />
    </a>
  );
}
