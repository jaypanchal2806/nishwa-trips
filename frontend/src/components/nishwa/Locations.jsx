import { MapPin, ArrowUpRight } from "lucide-react";
import { LOCATIONS, BUSINESS } from "@/config/business";

// Duplicate list for seamless marquee
const MARQUEE = [...LOCATIONS, ...LOCATIONS];

export default function Locations() {
  return (
    <section id="locations" data-testid="locations-section" className="py-20 md:py-28 border-t border-stone-200 bg-[#FDF3E1]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-semibold">Top Locations</div>
          <h2 className="font-display font-semibold text-3xl md:text-5xl mt-2 tracking-tight leading-[1.05]">
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
              href={`${BUSINESS.whatsappBase}?text=${encodeURIComponent(`Hi Nishwa Tours, I want a cab from Ahmedabad to ${city}.`)}`}
              target="_blank" rel="noreferrer"
              data-testid={`location-${city.toLowerCase().replace(/\s+/g,'-')}`}
              className="group flex items-center justify-between px-4 py-4 rounded-xl border border-stone-300/60 bg-white/70 backdrop-blur hover:border-[#D97706] hover:bg-white transition-colors duration-200"
            >
              <span className="flex items-center gap-2 text-[15px] font-medium">
                <MapPin className="w-4 h-4 text-[#D97706]" /> {city}
              </span>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#D97706] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          ))}
        </div>

        {/* Marquee strip */}
        <div className="mt-12 overflow-hidden -mx-5 md:-mx-8 border-y border-stone-300/60 py-4">
          <div className="marquee-track flex gap-10 whitespace-nowrap font-display font-semibold text-2xl md:text-3xl text-stone-800/80">
            {MARQUEE.map((c, i) => (
              <span key={i} className="flex items-center gap-10">
                {c}
                <span className="text-[#D97706]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
