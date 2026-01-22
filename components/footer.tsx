import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { SocialLinks } from "@/components/social-links";

const WHATSAPP_NUMBER = "5493516089206";

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

            {/* Social Media Links */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-muted-foreground">Seguinos en nuestras redes</p>
              <SocialLinks />
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white border-2 border-green-500 text-green-600 px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-[0.98]"
            >
              <Image
                src="/images/whatsapp-logo.png"
                alt="WhatsApp"
                width={24}
                height={24}
                className="rounded-sm"
              />
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
