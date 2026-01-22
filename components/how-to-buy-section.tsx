import { ShoppingCart, Smartphone, Truck } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Elegis los productos",
    description: "Navega el catalogo y agrega al carrito",
  },
  {
    icon: Smartphone,
    title: "Pedis por WhatsApp",
    description: "Envianos tu pedido con un click",
  },
  {
    icon: Truck,
    title: "Coordinamos entrega",
    description: "Retiro en local o envio a domicilio",
  },
];

export function HowToBuySection() {
  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Como comprar
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
