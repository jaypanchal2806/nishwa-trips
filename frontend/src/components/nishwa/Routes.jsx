import { ArrowRight, MapPin } from "lucide-react";
import { SAMPLE_ROUTES, POPULAR_ROUTES } from "@/config/routes";
import { BUSINESS } from "@/config/business";

const inr = (n) => "₹" + n.toLocaleString("en-IN");

const waLink = (from, to, extra = "") =>
  `${BUSINESS.whatsappBase}?text=${encodeURIComponent(
    `Hi Nishwa Tours, I want a one-way cab ${from} → ${to}.${extra ? " " + extra : ""}`
  )}`;

export default function Routes() {
  return (
    <section id="routes" data-testid="routes-section" className="py-20 md:py-28 bg-white border-t border-[#EEECFB]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* -------- Sample Route Fares -------- */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Transparent, All-Inclusive Fares</div>
          <h2 className="font-display font-bold italic text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] text-[#16183F]">
            Sample Route Fares
          </h2>
          <p className="text-stone-600 mt-3 leading-relaxed">
            No return fare, no hidden tolls or driver charges — the price you see is the price you pay.
          </p>
        </div>

        {/* Desktop table */}
        <div
          data-testid="routes-table-wrapper"
          className="mt-10 hidden md:block rounded-2xl border border-[#EEECFB] overflow-hidden shadow-[0_20px_60px_-30px_rgba(22,24,63,0.18)]"
        >
          <table className="w-full text-left">
            <thead className="bg-[#16183F] text-white">
              <tr>
                <th className="py-4 px-5 font-display italic font-bold text-[15px]">Route</th>
                <th className="py-4 px-5 font-display italic font-bold text-[15px]">KM</th>
                <th className="py-4 px-5 font-display italic font-bold text-[15px]">Swift Dzire</th>
                <th className="py-4 px-5 font-display italic font-bold text-[15px]">Ertiga</th>
                <th className="py-4 px-5 font-display italic font-bold text-[15px]">Innova Crysta</th>
                <th className="py-4 px-5"></th>
              </tr>
            </thead>
            <tbody className="text-[#16183F]">
              {SAMPLE_ROUTES.map((r, i) => (
                <tr
                  key={i}
                  data-testid={`route-row-${i}`}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-[#FBFAF7]"} border-t border-[#EEECFB] hover:bg-[#FFF1EB] transition-colors duration-200`}
                >
                  <td className="py-4 px-5 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FC5B22]" />
                      <span>{r.from} <span className="text-[#FC5B22]">→</span> {r.to}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-stone-600">{r.km} km</td>
                  <td className="py-4 px-5 font-semibold">{inr(r.dzire)}</td>
                  <td className="py-4 px-5 font-semibold">{inr(r.ertiga)}</td>
                  <td className="py-4 px-5 font-semibold">{inr(r.innova)}</td>
                  <td className="py-4 px-5">
                    <a
                      href={waLink(r.from, r.to, `${r.km} km. Please share options.`)}
                      target="_blank" rel="noreferrer"
                      data-testid={`route-book-${i}`}
                      className="inline-flex items-center gap-1 text-[#FC5B22] font-semibold text-sm hover:underline"
                    >
                      Book Now <ArrowRight className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="mt-10 md:hidden grid gap-4">
          {SAMPLE_ROUTES.map((r, i) => (
            <div
              key={i}
              data-testid={`route-card-${i}`}
              className="rounded-2xl border border-[#EEECFB] p-5 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-display italic font-bold text-[#16183F] text-lg">
                  {r.from} <span className="text-[#FC5B22]">→</span> {r.to}
                </div>
                <span className="text-xs text-stone-500">{r.km} km</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <FareCell label="Dzire"  value={inr(r.dzire)}  />
                <FareCell label="Ertiga" value={inr(r.ertiga)} />
                <FareCell label="Innova" value={inr(r.innova)} />
              </div>
              <a
                href={waLink(r.from, r.to, `${r.km} km. Please share options.`)}
                target="_blank" rel="noreferrer"
                className="btn-primary mt-4 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          Prices shown are indicative for sample routes.{" "}
          <a
            href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20please%20share%20fares%20for%20all%20routes.`}
            target="_blank" rel="noreferrer"
            data-testid="see-all-fares"
            className="text-[#FC5B22] font-semibold hover:underline"
          >
            See fares for all routes →
          </a>
        </p>

        {/* -------- Popular One-Way Routes -------- */}
        <div className="mt-24 text-center max-w-2xl mx-auto">
          <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Explore our routes</div>
          <h2 className="font-display font-bold italic text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] text-[#16183F]">
            Popular One-Way Routes
          </h2>
          <p className="text-stone-600 mt-3 leading-relaxed">
            Fixed fares, no surge pricing. Pick your route and book in seconds.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_ROUTES.map((r, i) => (
            <a
              key={i}
              href={waLink(r.from, r.to)}
              target="_blank" rel="noreferrer"
              data-testid={`popular-route-${i}`}
              className="group flex items-center justify-between gap-3 px-4 py-4 rounded-xl border border-[#EEECFB] bg-white hover:border-[#FC5B22] hover:bg-[#FFF1EB] transition-colors duration-200"
            >
              <span className="flex items-center gap-2 text-[15px] font-medium text-[#16183F]">
                <MapPin className="w-4 h-4 text-[#FC5B22] shrink-0" />
                <span>{r.from} <span className="text-[#FC5B22]">→</span> {r.to}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#FC5B22] group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20please%20share%20the%20full%20route%20list.`}
            target="_blank" rel="noreferrer"
            data-testid="view-all-routes"
            className="btn-navy inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
          >
            View All Routes <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FareCell({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FBFAF7] py-2.5 px-2 border border-[#EEECFB]">
      <div className="text-[10px] uppercase tracking-[0.16em] text-stone-500">{label}</div>
      <div className="font-display italic font-bold text-[#16183F] text-sm mt-0.5">{value}</div>
    </div>
  );
}
