import { MapPin, Clock, Truck, CreditCard, type LucideIcon } from "lucide-react";

interface InfoItem {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
  gradient: string;
}

const infoItems: InfoItem[] = [
  {
    icon: MapPin,
    title: "Dirección",
    content: "Mariano Fragueiro 3596, X5009 Córdoba",
    gradient: "from-red-500/10 to-orange-500/10",
  },
  {
    icon: Clock,
    title: "Horarios",
    content: (
      <div className="space-y-0.5">
        <p>Lun a Vie: 9:00 - 13:30 y 17:00 - 20:30</p>
        <p>Sábados: 9:00 - 13:30</p>
      </div>
    ),
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
    <section className="relative py-14 overflow-hidden bg-[#F0E5D8]">
      {/* Background */}

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
              className="group flex flex-col items-center text-center rounded-2xl bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
            >
              {/* Icon with gradient background */}
              <div className={`mb-3 sm:mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mb-1.5 font-bold text-foreground text-sm">
                {item.title}
              </h3>
              <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps Embed */}
        <div className="mt-10">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.8234567890123!2d-64.18765!3d-31.41234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28c6c6c6c6c%3A0x0!2sMariano%20Fragueiro%203596%2C%20X5009%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1704067200000!5m2!1ses!2sar&markers=color:red%7Clabel:E%7CMariano+Fragueiro+3596,+X5009+Córdoba"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de El Pelado"
              className="w-full"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            📍 Mariano Fragueiro 3596, X5009 Córdoba
          </p>
        </div>
      </div>
    </section>
  );
}
