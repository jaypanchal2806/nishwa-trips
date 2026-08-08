import { Users, Briefcase, Star } from "lucide-react";
import { FLEET, BUSINESS } from "@/config/business";

const IMGS = {
  Sedan:          "https://images.unsplash.com/photo-1555832438-e6ada221ff4d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxoaWdod2F5JTIwcm9hZCUyMHRyaXAlMjBzdW5zZXR8ZW58MHx8fHwxNzg2MTgwOTY4fDA&ixlib=rb-4.1.0&q=85",
  SUV:            "https://images.unsplash.com/photo-1661655335629-4056d80caa0a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHN1diUyMGNhciUyMHJvYWR8ZW58MHx8fHwxNzg2MTgwOTc2fDA&ixlib=rb-4.1.0&q=85",
  Ertiga:         "https://images.unsplash.com/photo-1564188537512-f6bd010d1e2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzdXYlMjBkcml2aW5nJTIwc3Vuc2V0JTIwcm9hZHxlbnwwfHx8fDE3ODYxODA5Njh8MA&ixlib=rb-4.1.0&q=85",
  "Innova Crysta":"https://images.unsplash.com/photo-1661655335629-4056d80caa0a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHN1diUyMGNhciUyMHJvYWR8ZW58MHx8fHwxNzg2MTgwOTc2fDA&ixlib=rb-4.1.0&q=85",
};

export default function Fleet() {
  return (
    <section id="fleet" data-testid="fleet-section" className="py-20 md:py-28 bg-[#16183F] text-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Our Fleet</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05]">
            Pick a car that fits your journey.
          </h2>
          <p className="text-white/70 mt-3 leading-relaxed">
            From compact sedans to premium Innova Crysta — every car is well-maintained,
            sanitised and driven by our verified chauffeurs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {FLEET.map((car) => (
            <article
              key={car.name}
              data-testid={`fleet-card-${car.name.toLowerCase().replace(/\s+/g,'-')}`}
              className="card-lift group rounded-2xl overflow-hidden bg-[#1B1F4B] border border-white/5 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-48 md:h-auto overflow-hidden">
                <img
                  src={IMGS[car.name]}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-xl">{car.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs bg-white/10 rounded-full px-2.5 py-1">
                      <Star className="w-3 h-3 fill-current text-[#FC5B22]" /> 4.9
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <Spec icon={<Users className="w-4 h-4" />} label={car.seats + " seats"} />
                    <Spec icon={<Briefcase className="w-4 h-4" />} label={car.luggage} />
                  </div>
                  <p className="text-[13px] text-stone-400 mt-3">Best for: {car.best}</p>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Starting</div>
                    <div className="font-display font-semibold text-2xl text-[#FC5B22]">{car.price}</div>
                  </div>
                  <a
                    href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20I%20want%20to%20book%20a%20${encodeURIComponent(car.name)}.`}
                    target="_blank" rel="noreferrer"
                    className="btn-whatsapp px-4 py-2.5 rounded-full text-sm font-semibold"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spec({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-stone-300">
      <span className="text-[#FC5B22]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
