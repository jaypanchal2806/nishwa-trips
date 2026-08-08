import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, ShieldCheck, BadgeCheck, Clock, Star } from "lucide-react";
import { ROUTE_BY_SLUG, ROUTES } from "@/config/routes";
import { BUSINESS, CAR_TYPES } from "@/config/business";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Header from "@/components/nishwa/Header";
import Footer from "@/components/nishwa/Footer";
import FloatingWhatsApp from "@/components/nishwa/FloatingWhatsApp";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const inr = (n) => "₹" + n.toLocaleString("en-IN");
const todayISO = () => new Date().toISOString().split("T")[0];

const waLink = (from, to, extra = "") =>
  `${BUSINESS.whatsappBase}?text=${encodeURIComponent(
    `Hi Nishwa Tours, I want to book a one-way cab: ${from} → ${to}.${extra ? " " + extra : ""}`
  )}`;

export default function RouteDetail() {
  const { slug } = useParams();
  const route = ROUTE_BY_SLUG[slug];

  if (!route) {
    return (
      <div className="min-h-screen bg-white text-[#16183F] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="font-script text-[#FC5B22] text-3xl">Route not found</div>
          <h1 className="font-display italic font-bold text-3xl mt-2">We don’t have that route yet.</h1>
          <p className="text-stone-600 mt-3">Please browse our route list — or ping us on WhatsApp for a custom quote.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/routes" className="btn-navy px-5 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> All Routes
            </Link>
            <a href={BUSINESS.whatsappBase} target="_blank" rel="noreferrer" className="btn-whatsapp px-5 py-3 rounded-full text-sm font-semibold">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    );
  }

  const otherRoutes = ROUTES.filter((r) => r.slug !== route.slug).slice(0, 6);

  return (
    <div data-testid="route-detail-page" className="min-h-screen bg-white text-[#16183F]">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-8">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-[#FC5B22]">Home</Link>
          <span>›</span>
          <Link to="/routes" className="hover:text-[#FC5B22]">Routes</Link>
          <span>›</span>
          <span className="text-[#16183F]">{route.from}</span>
          <span>›</span>
          <span className="text-[#16183F] font-medium">{route.to}</span>
        </nav>
        <div className="text-stone-600 text-sm mt-2">{route.from} to {route.to}</div>
      </div>

      {/* Title + Route */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 pb-12">
        <h1 className="font-display italic font-bold text-4xl md:text-6xl text-[#16183F] leading-[1.02] tracking-tight">
          {route.from} <span className="text-[#FC5B22]">→</span> {route.to}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EEECFB] text-sm font-medium">
            <MapPin className="w-4 h-4 text-[#FC5B22]" /> {route.km} km
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF1EB] border border-[#FDD0BE] text-[#FC5B22] text-sm font-semibold">
            <BadgeCheck className="w-4 h-4" /> Fixed Pricing
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9F8EF] border border-[#B4E7C7] text-[#0F7B3B] text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" /> Verified Route
          </span>
        </div>

        {/* Two-column: Price card + Booking form */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8">
          {/* Price hero card */}
          <div className="lg:col-span-5">
            <div
              data-testid="route-price-card"
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B1F4B] via-[#2A2D6B] to-[#FC5B22] text-white p-8 shadow-[0_30px_80px_-30px_rgba(22,24,63,0.45)]"
            >
              <div className="text-[11px] uppercase tracking-[0.28em] text-white/80 text-center">
                One Way Starts From
              </div>
              <div className="font-display italic font-bold text-white text-center text-6xl md:text-7xl mt-3 leading-none">
                {inr(route.dzire)}
              </div>
              <div className="text-white/80 text-center text-sm mt-3">
                Swift Dzire · {route.km} km · all-inclusive
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href={waLink(route.from, route.to, `${route.km} km. Fare quoted ${inr(route.dzire)}.`)}
                  target="_blank" rel="noreferrer"
                  data-testid="route-whatsapp-btn"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#FBB03B] hover:bg-[#F09D22] text-[#1B1F4B] font-bold italic font-display text-[15px] transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Booking
                </a>
                <a
                  href="#book-online"
                  data-testid="route-book-online-btn"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#FC5B22] hover:bg-[#E14812] text-white font-bold italic font-display text-[15px] transition-colors duration-200"
                >
                  Book Online <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <TrustBadge icon={<Clock className="w-4 h-4" />} text="24 / 7" />
              <TrustBadge icon={<ShieldCheck className="w-4 h-4" />} text="Verified" />
              <TrustBadge icon={<Star className="w-4 h-4 fill-[#FC5B22] text-[#FC5B22]" />} text="4.9 rated" />
            </div>
          </div>

          {/* Fare per car type + booking form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#EEECFB] p-6 md:p-8 bg-white shadow-sm">
              <div className="font-script text-[#FC5B22] text-2xl md:text-3xl">Fare by car type</div>
              <h3 className="font-display italic font-bold text-2xl md:text-3xl text-[#16183F] mt-1 leading-tight">
                Choose the car that fits your journey
              </h3>

              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <FareCard title="Swift Dzire"   sub="4 + 1 · 2 bags"  price={inr(route.dzire)}  />
                <FareCard title="Ertiga"        sub="6 + 1 · 3 bags"  price={inr(route.ertiga)} />
                <FareCard title="Innova Crysta" sub="6 + 1 · 4 bags"  price={inr(route.innova)} />
              </div>

              <div id="book-online" className="mt-8 pt-8 border-t border-[#EEECFB]">
                <RouteBookingForm route={route} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other routes */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
        <div className="font-script text-[#FC5B22] text-2xl md:text-3xl">You may also like</div>
        <h3 className="font-display italic font-bold text-2xl md:text-4xl text-[#16183F] mt-1">Other popular routes</h3>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherRoutes.map((r) => (
            <Link
              key={r.slug}
              to={`/routes/${r.slug}`}
              data-testid={`other-route-${r.slug}`}
              className="card-lift rounded-2xl border border-[#EEECFB] p-5 bg-white flex items-center justify-between hover:border-[#FC5B22] transition-colors duration-200"
            >
              <div>
                <div className="font-display italic font-bold text-[#16183F] text-lg">
                  {r.from} <span className="text-[#FC5B22]">→</span> {r.to}
                </div>
                <div className="text-xs text-stone-500 mt-1">{r.km} km · from {inr(r.dzire)}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#FC5B22]" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/routes"
            data-testid="view-all-routes-cta"
            className="btn-navy inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold"
          >
            View All Routes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// ---------------- Sub components ----------------

function TrustBadge({ icon, text }) {
  return (
    <div className="rounded-xl bg-white border border-[#EEECFB] py-3 text-center">
      <div className="inline-flex items-center gap-1.5 text-[#16183F] text-xs font-semibold">
        <span className="text-[#FC5B22]">{icon}</span> {text}
      </div>
    </div>
  );
}

function FareCard({ title, sub, price }) {
  return (
    <div className="rounded-2xl border border-[#EEECFB] bg-[#FBFAF7] p-4 text-center">
      <div className="font-display italic font-bold text-[#16183F] text-lg">{title}</div>
      <div className="text-[11px] uppercase tracking-[0.16em] text-stone-500 mt-1">{sub}</div>
      <div className="font-display italic font-bold text-2xl text-[#FC5B22] mt-3">{price}</div>
    </div>
  );
}

function RouteBookingForm({ route }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    car_type: CAR_TYPES[0],
    trip_type: "One Way",
    pickup: route.from,
    drop: route.to,
    travel_date: todayISO(),
    message: `Route: ${route.from} → ${route.to} (${route.km} km).`,
  });
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const fareFor = (t) => (t === "Swift Dzire" ? route.dzire : t === "Ertiga" ? route.ertiga : route.innova);

  const buildWA = () => {
    const msg = [
      `Hi Nishwa Tours, I want to book:`,
      `• Route: ${route.from} → ${route.to} (${route.km} km)`,
      `• Name: ${form.name}`,
      `• Phone: ${form.phone}`,
      `• Car: ${form.car_type} — Fare ${inr(fareFor(form.car_type))}`,
      `• Trip: ${form.trip_type}`,
      `• Date: ${form.travel_date}`,
    ].join("\n");
    return `${BUSINESS.whatsappBase}?text=${encodeURIComponent(msg)}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please add your name and phone.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, form);
      toast.success("Enquiry saved! Opening WhatsApp…");
      setTimeout(() => window.open(buildWA(), "_blank", "noopener,noreferrer"), 400);
    } catch (err) {
      toast.error("Could not save. Redirecting to WhatsApp anyway…");
      window.open(buildWA(), "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} data-testid="route-booking-form">
      <div className="font-display italic font-bold text-xl text-[#16183F]">Complete your booking</div>
      <p className="text-sm text-stone-500 mt-1">Pickup and drop are pre-filled for this route.</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name">
          <input required data-testid="rt-input-name" value={form.name} onChange={update("name")} placeholder="Your name" className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400" />
        </Field>
        <Field label="Phone">
          <input required data-testid="rt-input-phone" value={form.phone} onChange={update("phone")} placeholder="Mobile number" inputMode="tel" className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400" />
        </Field>
        <Field label="Car Type">
          <select data-testid="rt-select-car" value={form.car_type} onChange={update("car_type")} className="w-full bg-transparent outline-none text-[15px] text-[#16183F]">
            {CAR_TYPES.map((c) => <option key={c} value={c}>{c} — {inr(fareFor(c))}</option>)}
          </select>
        </Field>
        <Field label="Travel Date">
          <input required type="date" data-testid="rt-input-date" min={todayISO()} value={form.travel_date} onChange={update("travel_date")} className="w-full bg-transparent outline-none text-[15px] text-[#16183F]" />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        data-testid="rt-submit-btn"
        className="btn-primary mt-6 w-full py-3.5 rounded-full font-bold italic font-display text-[15px] disabled:opacity-60"
      >
        {loading ? "Sending…" : `Confirm ${inr(fareFor(form.car_type))} Booking`}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-[12px] font-semibold text-[#16183F] mb-1.5">{label}</div>
      <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-[#EEECFB] bg-white focus-within:border-[#FC5B22] transition-colors duration-200">
        {children}
      </div>
    </label>
  );
}
