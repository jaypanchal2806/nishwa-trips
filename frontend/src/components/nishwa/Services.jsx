import { ArrowUpRight, Route, Repeat, Clock, Plane, Building2 } from "lucide-react";
import { SERVICES, BUSINESS } from "@/config/business";

const ICONS = {
  oneway:    Route,
  roundtrip: Repeat,
  local:     Clock,
  outstation:Building2,
  airport:   Plane,
};

export default function Services() {
  return (
    <section id="services" data-testid="services-section" className="py-20 md:py-28 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Cab services we offer</div>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] max-w-2xl text-[#16183F]">
              Built for every kind of journey.
            </h2>
          </div>
          <a
            href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Travels,%20please%20share%20your%20fare%20chart.`}
            target="_blank" rel="noreferrer"
            data-testid="services-cta"
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
          >
            See fare chart <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.key] || Route;
            return (
              <div
                key={s.key}
                data-testid={`service-card-${s.key}`}
                className="card-lift group relative rounded-2xl border border-stone-200 bg-white p-6 md:p-7 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FFF1EB] text-[#FC5B22] grid place-items-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mt-5">{s.title}</h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-stone-500">0{i+1}</span>
                  <a
                    href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Travels,%20I%20need%20${encodeURIComponent(s.title)}.`}
                    target="_blank" rel="noreferrer"
                    className="text-sm font-medium text-[#16183F] group-hover:text-[#FC5B22] inline-flex items-center gap-1 transition-colors duration-200"
                  >
                    Enquire <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
