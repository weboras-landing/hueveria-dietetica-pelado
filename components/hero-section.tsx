import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full">
      {/* Hero Image Container */}
      <div className="relative w-full h-[300px] md:h-[380px] overflow-hidden">
        {/* Background Image with overlay */}
        <Image
          src="/images/hero-banner.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

        {/* Badge with premium styling */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-secondary/30 backdrop-blur-sm border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            Venta por mayor y menor
          </span>
        </div>

        {/* Centered logo with glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div className="relative w-52 h-52 md:w-72 md:h-72">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-75" />
            <Image
              src="/images/logo-mascot.png"
              alt="Hueveria y Dietetica El Pelado"
              fill
              className="object-contain drop-shadow-2xl relative z-10"
              priority
            />
          </div>
        </div>
      </div>

      {/* Catalog Title Section with refined styling */}
      <div className="relative bg-gradient-to-b from-white to-gray-50/50 py-8 text-center">
        {/* Decorative accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Catálogo Virtual
        </h1>
        <p className="mt-2 text-muted-foreground text-[15px] max-w-xs mx-auto">
          Explorá y comprá online nuestros productos de calidad
        </p>

        {/* Scroll indicator for mobile */}
        <div className="mt-6 flex justify-center md:hidden">
          <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
            <span className="text-xs font-medium">Ver categorías</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
