import { MapPin, Clock, Truck, CreditCard } from "lucide-react";

const infoItems = [
  {
    icon: MapPin,
    title: "Direccion",
    content: "Consultar por WhatsApp",
  },
  {
    icon: Clock,
    title: "Horarios",
    content: "Lunes a Sabado de 9:00 a 18:00",
  },
  {
    icon: Truck,
    title: "Envios",
    content: "Envio a domicilio o retiro en local",
  },
  {
    icon: CreditCard,
    title: "Medios de pago",
    content: "Efectivo, transferencia, Mercado Pago",
  },
];

export function StoreInfoSection() {
  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Informacion del local
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center rounded-lg bg-card p-6 shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
