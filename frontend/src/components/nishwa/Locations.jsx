import { MapPin, ArrowUpRight } from "lucide-react";
import { LOCATIONS, BUSINESS } from "@/config/business";

// Duplicate list for seamless marquee
const MARQUEE = [...LOCATIONS, ...LOCATIONS];

export default function Locations() {
  return (
    <section id="locations" data-testid="locations-section" className="py-20 md:py-28 border-t border-stone-200 bg-[#FFF1EB]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Top Locations</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] text-[#16183F]">
            75+ cities. 521+ routes. One trusted cab.
          </h2>
          <p className="text-stone-700 mt-3 leading-relaxed">
            Popular destinations from Ahmedabad — tap any city to book instantly on WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {LOCATIONS.map((city) => (
            <a
              key={city}
              href={`${BUSINESS.whatsappBase}?text=${encodeURIComponent(`Hi Nishwa Travels, I want a cab from Ahmedabad to ${city}.`)}`}
              target="_blank" rel="noreferrer"
              data-testid={`location-${city.toLowerCase().replace(/\s+/g,'-')}`}
              className="group flex items-center justify-between px-4 py-4 rounded-xl border border-stone-300/60 bg-white/70 backdrop-blur hover:border-[#FC5B22] hover:bg-white transition-colors duration-200"
            >
              <span className="flex items-center gap-2 text-[15px] font-medium">
                <MapPin className="w-4 h-4 text-[#FC5B22]" /> {city}
              </span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#FC5B22] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          ))}
        </div>

        {/* Marquee strip */}
        <div className="mt-12 overflow-hidden -mx-5 md:-mx-8 border-y border-stone-300/60 py-4">
          <div className="marquee-track flex gap-10 whitespace-nowrap font-display font-semibold text-2xl md:text-3xl text-stone-800/80">
            {MARQUEE.map((c, i) => (
              <span key={i} className="flex items-center gap-10">
                {c}
                <span className="text-[#FC5B22]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
