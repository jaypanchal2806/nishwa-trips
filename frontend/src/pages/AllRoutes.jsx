import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config/routes";
import Header from "@/components/nishwa/Header";
import Footer from "@/components/nishwa/Footer";
import FloatingWhatsApp from "@/components/nishwa/FloatingWhatsApp";

const inr = (n) => "₹" + n.toLocaleString("en-IN");

export default function AllRoutes() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ROUTES;
    return ROUTES.filter(
      (r) =>
        r.from.toLowerCase().includes(s) ||
        r.to.toLowerCase().includes(s) ||
        `${r.from} to ${r.to}`.toLowerCase().includes(s)
    );
  }, [q]);

  // Group by pickup city
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      (map[r.from] ||= []).push(r);
    });
    return map;
  }, [filtered]);

  return (
    <div data-testid="all-routes-page" className="min-h-screen bg-white text-[#16183F]">
      <Header />

      {/* Header banner */}
      <section className="bg-[#16183F] text-white pt-14 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="mt-6 text-center max-w-2xl mx-auto">
            <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Explore Our Routes</div>
            <h1 className="font-display italic font-bold text-4xl md:text-6xl mt-1 tracking-tight leading-[1.05]">
              All One-Way Routes
            </h1>
            <p className="text-white/70 mt-3 leading-relaxed">
              Fixed fares. No surge pricing. Every route on this page includes tolls, driver &amp; parking.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3.5 shadow-lg">
              <Search className="w-5 h-5 text-[#FC5B22]" />
              <input
                data-testid="routes-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by city — e.g. Udaipur"
                className="flex-1 bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-xs text-stone-500 hover:text-[#FC5B22]">
                  Clear
                </button>
              )}
            </div>
            <div className="text-center text-white/60 text-xs mt-3">
              Showing {filtered.length} of {ROUTES.length} routes
            </div>
          </div>
        </div>
      </section>

      {/* Routes list — grouped by pickup city */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-20 text-stone-500">
            No routes match “{q}”. Try another city.
          </div>
        )}

        {Object.entries(grouped).map(([city, list]) => (
          <div key={city} className="mb-12">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display italic font-bold text-2xl md:text-3xl text-[#16183F]">
                From <span className="text-[#FC5B22]">{city}</span>
              </h2>
              <span className="text-sm text-stone-500">{list.length} routes</span>
            </div>

            {/* Table (desktop) */}
            <div className="mt-5 hidden md:block rounded-2xl border border-[#EEECFB] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#FBFAF7]">
                  <tr>
                    <th className="py-3.5 px-5 font-display italic font-bold text-sm text-[#16183F]">Route</th>
                    <th className="py-3.5 px-5 font-display italic font-bold text-sm text-[#16183F]">KM</th>
                    <th className="py-3.5 px-5 font-display italic font-bold text-sm text-[#16183F]">Swift Dzire</th>
                    <th className="py-3.5 px-5 font-display italic font-bold text-sm text-[#16183F]">Ertiga</th>
                    <th className="py-3.5 px-5 font-display italic font-bold text-sm text-[#16183F]">Innova Crysta</th>
                    <th className="py-3.5 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r, i) => (
                    <tr
                      key={r.slug}
                      data-testid={`all-route-row-${r.slug}`}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#FBFAF7]"} border-t border-[#EEECFB] hover:bg-[#FFF1EB] transition-colors duration-200`}
                    >
                      <td className="py-3.5 px-5 font-medium text-[#16183F]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FC5B22]" />
                          {r.from} <span className="text-[#FC5B22]">→</span> {r.to}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-stone-600">{r.km} km</td>
                      <td className="py-3.5 px-5 font-semibold text-[#16183F]">{inr(r.dzire)}</td>
                      <td className="py-3.5 px-5 font-semibold text-[#16183F]">{inr(r.ertiga)}</td>
                      <td className="py-3.5 px-5 font-semibold text-[#16183F]">{inr(r.innova)}</td>
                      <td className="py-3.5 px-5">
                        <Link
                          to={`/routes/${r.slug}`}
                          data-testid={`all-route-book-${r.slug}`}
                          className="inline-flex items-center gap-1 text-[#FC5B22] font-semibold text-sm hover:underline"
                        >
                          Book Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mt-5 md:hidden grid gap-3">
              {list.map((r) => (
                <Link
                  key={r.slug}
                  to={`/routes/${r.slug}`}
                  className="rounded-2xl border border-[#EEECFB] p-4 bg-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-display italic font-bold text-[#16183F]">
                      {r.from} <span className="text-[#FC5B22]">→</span> {r.to}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{r.km} km · from {inr(r.dzire)}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#FC5B22]" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
