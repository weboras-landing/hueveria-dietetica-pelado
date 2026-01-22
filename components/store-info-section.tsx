import { MapPin, Clock, Truck, CreditCard, type LucideIcon } from "lucide-react";

interface InfoItem {
  icon: LucideIcon;
  title: string;
  content: string;
  gradient: string;
}

const infoItems: InfoItem[] = [
  {
    icon: MapPin,
    title: "Dirección",
    content: "Mariano Fragueiro 3596",
    gradient: "from-red-500/10 to-orange-500/10",
  },
  {
    icon: Clock,
    title: "Horarios",
    content: "Lun-Sáb: 9:00-13:30 y 17:00-20:30",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Truck,
    title: "Envíos",
    content: "Envío a domicilio o retiro en local",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: CreditCard,
    title: "Medios de pago",
    content: "Efectivo, transferencia, Mercado Pago",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
];

export function StoreInfoSection() {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/80" />

      <div className="container mx-auto px-5 relative">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-primary/70 uppercase tracking-widest mb-2">
            Información útil
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Sobre el local
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
            >
              {/* Icon with gradient background */}
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mb-1.5 font-bold text-foreground text-sm">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
