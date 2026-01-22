import { Leaf, Heart } from "lucide-react";

export function AboutSection() {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

      <div className="container mx-auto px-5 relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* Decorative badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Sobre Nosotros</span>
            <Leaf className="w-4 h-4" />
          </div>

          <h2 className="mb-5 text-2xl md:text-3xl font-bold text-foreground">
            Calidad y atención personalizada
          </h2>

          <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">
            Somos un comercio local dedicado a la venta de{" "}
            <span className="font-semibold text-foreground">huevos, frutos secos, semillas y productos de dietética</span>,
            ofreciendo calidad y atención personalizada a cada cliente.
          </p>

          {/* Highlight badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium">
              🥚 Huevos frescos
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary px-4 py-2 rounded-full text-sm font-medium">
              🌰 Frutos secos
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium">
              🌱 Dietética
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
