import Image from "next/image";
import { MessageCircle, MapPin, Clock } from "lucide-react";

const WHATSAPP_NUMBER = "5491112345678"; // Cambiar por el número real

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Main footer with gradient */}
      <div className="bg-gradient-to-b from-primary/5 via-primary/10 to-primary/15 border-t border-primary/10 pt-10 pb-8">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:20px_20px]" />

        <div className="container mx-auto px-5 relative">
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Logo with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
              <div className="relative h-20 w-20 bg-white rounded-full p-2 shadow-lg border border-primary/10">
                <Image
                  src="/images/logo-mascot.png"
                  alt="El Pelado"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Brand name */}
            <div>
              <p className="font-serif text-xl font-bold text-foreground">
                Huevería y Dietética El Pelado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Catálogo Virtual · Venta por mayor y menor
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-200 hover:scale-105 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contactanos por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-primary/20 py-4">
        <div className="container mx-auto px-5">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} El Pelado. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
