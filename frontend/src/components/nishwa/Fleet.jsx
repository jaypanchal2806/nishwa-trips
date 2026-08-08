import { Users, Briefcase, Star } from "lucide-react";
import { FLEET, BUSINESS } from "@/config/business";

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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLEET.map((car) => (
            <article
              key={car.name}
              data-testid={`fleet-card-${car.name.toLowerCase().replace(/\s+/g,'-')}`}
              className="card-lift group rounded-2xl overflow-hidden bg-[#1B1F4B] border border-white/5 flex flex-col"
            >
              <div className="w-full h-56 bg-white grid place-items-center overflow-hidden">
                <img
                  src={car.img}
                  alt={car.name}
                  className="max-h-52 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display italic font-bold text-xl">{car.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs bg-white/10 rounded-full px-2.5 py-1">
                      <Star className="w-3 h-3 fill-current text-[#FC5B22]" /> 4.9
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <Spec icon={<Users className="w-4 h-4" />} label={car.seats + " seats"} />
                    <Spec icon={<Briefcase className="w-4 h-4" />} label={car.luggage} />
                  </div>
                  <p className="text-[13px] text-white/60 mt-3">Best for: {car.best}</p>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/50">Rate</div>
                    <div className="font-display italic font-bold text-2xl text-[#FC5B22]">{car.price}</div>
                  </div>
                  <a
                    href={`${BUSINESS.whatsappBase}?text=${encodeURIComponent(`Hi Nishwa Tours, I want to book a ${car.name}.`)}`}
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
    <div className="flex items-center gap-2 text-white/80">
      <span className="text-[#FC5B22]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
