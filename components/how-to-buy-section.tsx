import { ShoppingCart, Smartphone, Truck } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Elegí los productos",
    description: "Navegá el catálogo y agregá al carrito",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Smartphone,
    title: "Pedí por WhatsApp",
    description: "Envianos tu pedido con un click",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Truck,
    title: "Coordinamos entrega",
    description: "Retiro en local o envío a domicilio",
    color: "from-teal-500 to-teal-600",
  },
];

export function HowToBuySection() {
  return (
    <section className="relative py-14 overflow-hidden bg-[#F0E5D8]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="container mx-auto px-5 relative">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-primary/70 uppercase tracking-widest mb-2">
            Proceso simple
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ¿Cómo comprar?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Numbered icon with gradient */}
              <div className="relative mb-5">
                {/* Animated ring on hover */}
                <div className="absolute inset-0 rounded-full bg-primary/10 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-[1.8] transition-all duration-500" />

                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>

                {/* Icon container with gradient */}
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3`}>
                  <step.icon className="h-8 w-8" />
                </div>
              </div>

              <h3 className="mb-2 text-lg font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
