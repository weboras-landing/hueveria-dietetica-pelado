import Image from "next/image";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5491112345678"; // Cambiar por el número real

export function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-16 w-16">
            <Image
              src="/images/logo-mascot.png"
              alt="El Pelado"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-serif text-lg font-bold text-foreground">
              Hueveria y Dietetica El Pelado
            </p>
            <p className="text-sm text-muted-foreground">Catalogo Virtual</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contactanos por WhatsApp</span>
          </a>
          <p className="text-xs text-muted-foreground mt-4">
            Venta por mayor y menor
          </p>
        </div>
      </div>
    </footer>
  );
}
