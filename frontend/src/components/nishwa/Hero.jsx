import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar, MapPin, Phone as PhoneIcon, User, ArrowRight, Sparkles } from "lucide-react";
import { BUSINESS, CAR_TYPES, TRIP_TYPES } from "@/config/business";

const HERO_IMG = "https://images.unsplash.com/photo-1564188537512-f6bd010d1e2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzdXYlMjBkcml2aW5nJTIwc3Vuc2V0JTIwcm9hZHxlbnwwfHx8fDE3ODYxODA5Njh8MA&ixlib=rb-4.1.0&q=85";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function Hero({ apiBase }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    car_type: CAR_TYPES[0],
    trip_type: TRIP_TYPES[0],
    pickup: "Ahmedabad",
    drop: "",
    travel_date: todayISO(),
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const buildWhatsAppLink = (f) => {
    const msg = [
      `Hi ${BUSINESS.short}, I would like to book a cab:`,
      `• Name: ${f.name}`,
      `• Phone: ${f.phone}`,
      `• Car Type: ${f.car_type}`,
      `• Trip Type: ${f.trip_type}`,
      `• Pickup: ${f.pickup}`,
      `• Drop: ${f.drop}`,
      `• Date: ${f.travel_date}`,
      f.message ? `• Notes: ${f.message}` : "",
      ``,
      `Please share the fare and driver details. Thank you!`,
    ].filter(Boolean).join("\n");
    return `${BUSINESS.whatsappBase}?text=${encodeURIComponent(msg)}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.pickup || !form.drop || !form.travel_date) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${apiBase}/bookings`, form);
      toast.success("Enquiry saved! Opening WhatsApp…");
      // Slight delay so toast is visible
      setTimeout(() => {
        window.open(buildWhatsAppLink(form), "_blank", "noopener,noreferrer");
      }, 400);
    } catch (err) {
      console.error(err);
      toast.error("Could not save enquiry. Redirecting to WhatsApp anyway…");
      window.open(buildWhatsAppLink(form), "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="top" data-testid="hero-section" className="relative overflow-hidden">
      {/* soft warm background wash */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,#FCE7B5_0%,#FDFBF7_45%)]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Text */}
        <div className="lg:col-span-7 fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1917] text-[#FDFBF7] text-[11px] uppercase tracking-[0.22em]">
            <Sparkles className="w-3.5 h-3.5" /> Ahmedabad · Since {BUSINESS.established}
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-6xl leading-[1.02] tracking-tight mt-6">
            OneWay Ride, <span className="text-[#D97706]">Anytime</span>
            <br />
            AnyWhere from Ahmedabad.
          </h1>

          <p className="mt-5 text-stone-600 text-lg md:text-xl max-w-xl leading-relaxed">
            Trusted intercity cab & tour service by <span className="font-medium text-stone-800">{BUSINESS.name}</span>.
            521+ routes, verified drivers, transparent per-km fare — book in seconds.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20I%20want%20to%20book%20a%20cab.`}
              target="_blank" rel="noreferrer"
              data-testid="hero-whatsapp-cta"
              className="btn-whatsapp inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold"
            >
              Book on WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${BUSINESS.phone}`}
              data-testid="hero-call-cta"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border border-stone-300 hover:border-[#1C1917] transition-colors duration-200"
            >
              <PhoneIcon className="w-4 h-4" /> {BUSINESS.phoneDisplay}
            </a>
          </div>

          {/* Hero image */}
          <div className="mt-10 relative rounded-2xl overflow-hidden border border-stone-200 shadow-[0_30px_80px_-40px_rgba(28,25,23,0.4)]">
            <img
              src={HERO_IMG}
              alt="SUV on sunset road"
              className="w-full h-[280px] md:h-[360px] object-cover"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-[#1C1917]/85 to-transparent">
              <div className="flex flex-wrap gap-4 text-[#FDFBF7]">
                <Stat k="521+" v="Routes" />
                <Stat k="75+"  v="Cities" />
                <Stat k="10k+" v="Happy Riders" />
                <Stat k="4.9★" v="Avg Rating" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <form
            onSubmit={onSubmit}
            data-testid="booking-form"
            className="bg-white rounded-2xl shadow-xl border border-stone-200 p-5 md:p-7"
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-semibold">Book your Ride</div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mt-1 leading-tight">
              Get a fare in 60 seconds
            </h2>
            <p className="text-sm text-stone-500 mt-1">Fill the form — we save it & open WhatsApp for you.</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field icon={<User className="w-4 h-4" />} label="Your Name">
                <input
                  required
                  data-testid="input-name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Full name"
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </Field>
              <Field icon={<PhoneIcon className="w-4 h-4" />} label="Phone">
                <input
                  required
                  data-testid="input-phone"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="10-digit mobile"
                  inputMode="tel"
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </Field>

              <Field label="Car Type">
                <select
                  data-testid="select-car"
                  value={form.car_type}
                  onChange={update("car_type")}
                  className="w-full bg-transparent outline-none text-sm text-stone-900"
                >
                  {CAR_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Trip Type">
                <select
                  data-testid="select-trip"
                  value={form.trip_type}
                  onChange={update("trip_type")}
                  className="w-full bg-transparent outline-none text-sm text-stone-900"
                >
                  {TRIP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field icon={<MapPin className="w-4 h-4" />} label="Pickup">
                <input
                  required
                  data-testid="input-pickup"
                  value={form.pickup}
                  onChange={update("pickup")}
                  placeholder="e.g. Ahmedabad"
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </Field>
              <Field icon={<MapPin className="w-4 h-4" />} label="Drop">
                <input
                  required
                  data-testid="input-drop"
                  value={form.drop}
                  onChange={update("drop")}
                  placeholder="e.g. Udaipur"
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </Field>

              <Field icon={<Calendar className="w-4 h-4" />} label="Travel Date" span2>
                <input
                  required
                  type="date"
                  data-testid="input-date"
                  value={form.travel_date}
                  onChange={update("travel_date")}
                  min={todayISO()}
                  className="w-full bg-transparent outline-none text-sm text-stone-900"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="booking-submit-button"
              className="btn-primary mt-5 w-full py-3.5 rounded-full font-semibold text-[15px] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send Enquiry & Open WhatsApp"}
            </button>
            <p className="text-[11px] text-stone-500 mt-3 text-center">
              By submitting you agree to be contacted about your booking.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, icon, children, span2 }) {
  return (
    <label className={`block ${span2 ? "sm:col-span-2" : ""}`}>
      <div className="text-[11px] uppercase tracking-[0.16em] font-medium text-stone-500 mb-1.5">{label}</div>
      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-stone-200 bg-[#FDFBF7] focus-within:border-[#D97706] focus-within:bg-white transition-colors duration-200">
        {icon && <span className="text-stone-400">{icon}</span>}
        {children}
      </div>
    </label>
  );
}

function Stat({ k, v }) {
  return (
    <div>
      <div className="font-display font-semibold text-2xl md:text-3xl leading-none">{k}</div>
      <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 mt-1">{v}</div>
    </div>
  );
}
