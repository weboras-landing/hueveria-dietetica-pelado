import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden">
        {/* Blurred background */}
        <Image
          src="/images/hero-banner.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-block bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
            Venta por mayor y menor
          </span>
        </div>
        {/* Centered logo */}
        <div className="absolute inset-0 flex items-center justify-center pt-6">
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            <Image
              src="/images/logo-mascot.png"
              alt="Hueveria y Dietetica El Pelado"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
      <div className="bg-card py-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Catalogo Virtual
        </h1>
        <p className="mt-1 text-muted-foreground">
          Compra online nuestros productos.
        </p>
      </div>
    </section>
  );
}
