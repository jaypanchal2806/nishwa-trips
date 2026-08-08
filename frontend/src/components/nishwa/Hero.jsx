import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar, MapPin, Phone as PhoneIcon, User, ArrowRight } from "lucide-react";
import { BUSINESS, CAR_TYPES, TRIP_TYPES } from "@/config/business";

const CAR_IMG_LEFT  = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&auto=format&fit=crop&w=800&q=80";
const CAR_IMG_RIGHT = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=srgb&fm=jpg&auto=format&fit=crop&w=900&q=80";

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
  const setTrip = (t) => setForm({ ...form, trip_type: t });

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
    <>
      {/* ============ NAVY HERO ============ */}
      <section id="top" data-testid="hero-section" className="relative bg-[#16183F] overflow-hidden">
        {/* Faint blueprint car silhouettes */}
        <svg className="car-outline top-24 left-1/2 -translate-x-1/2 w-[900px] h-auto text-white" viewBox="0 0 640 200" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M40 140 L90 90 L230 90 L280 60 L440 60 L510 100 L600 100 L600 140 Z" strokeLinejoin="round"/>
          <circle cx="150" cy="150" r="24"/>
          <circle cx="470" cy="150" r="24"/>
        </svg>

        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-24 md:pb-32 relative">
          {/* Big Brand Wordmark */}
          <div className="text-center fade-up">
            <div className="inline-flex items-center gap-3 md:gap-4">
              <img src="/nishwa-logo.jpg" alt="Nishwa" className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg" />
              <h1 className="font-display italic font-bold text-white text-4xl md:text-6xl leading-none tracking-tight">
                <span className="text-[#FC5B22]">NISHWA</span> <span>Travels</span><span className="text-[#FC5B22] text-2xl md:text-4xl align-top">.in</span>
              </h1>
            </div>

            <h2 className="mt-8 md:mt-10 font-display italic font-bold text-[#FC5B22] text-3xl md:text-5xl leading-[1.05] tracking-tight">
              OneWay Ride Anytime‑AnyWhere in Ahmedabad
            </h2>
            <p className="mt-3 md:mt-4 font-display italic font-bold text-white text-2xl md:text-4xl leading-tight">
              Book your Ride on your <span className="underline decoration-[#FC5B22] decoration-4 underline-offset-4">FingerTips!</span>
            </p>

            <p className="mt-6 text-white/75 max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed">
              Our Services Available in <b className="text-white">75+ Cities / Villages</b> and provide
              OneWayCab Services on <b className="text-white">521+ Routes</b> in Gujarat.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <a
                href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Travels,%20I%20want%20to%20book%20a%20cab.`}
                target="_blank" rel="noreferrer"
                data-testid="hero-whatsapp-cta"
                className="btn-outline-orange inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold italic font-display tracking-wide"
              >
                Book Now
              </a>
              <a
                href="#booking"
                data-testid="hero-scroll-cta"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
              >
                Fill Enquiry Form <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Floating white cars row */}
          <div className="mt-14 md:mt-16 relative grid grid-cols-2 gap-6 md:gap-10 items-end">
            <img
              src={CAR_IMG_LEFT}
              alt="Sedan"
              className="floaty w-full max-w-[440px] justify-self-end rounded-2xl shadow-2xl"
              loading="eager"
            />
            <img
              src={CAR_IMG_RIGHT}
              alt="SUV"
              className="floaty-slow w-full max-w-[480px] rounded-2xl shadow-2xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Diagonal white divider */}
        <div className="hero-wave" />
      </section>

      {/* ============ BOOKING (Trip Toggle + Form) ============ */}
      <section id="booking" data-testid="booking-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center">
            <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Hire us for</div>
            <div className="mt-4 flex justify-center">
              <div className="trip-pill" data-testid="trip-toggle">
                <button
                  type="button"
                  data-testid="trip-oneway"
                  className={form.trip_type === "One Way" ? "is-active" : ""}
                  onClick={() => setTrip("One Way")}
                >
                  Oneway Trip
                </button>
                <span className="or-badge">or</span>
                <button
                  type="button"
                  data-testid="trip-round"
                  className={form.trip_type === "Round Trip" ? "is-active" : ""}
                  onClick={() => setTrip("Round Trip")}
                >
                  Round Trip
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid lg:grid-cols-12 gap-10 items-center">
            {/* Left image */}
            <div className="lg:col-span-5">
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=srgb&fm=jpg&auto=format&fit=crop&w=900&q=80"
                alt="Cab"
                className="w-full rounded-3xl shadow-xl"
              />
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Stat k="521+" v="Routes" />
                <Stat k="75+"  v="Cities" />
                <Stat k="4.9★" v="Rating" />
              </div>
            </div>

            {/* Right form */}
            <form
              onSubmit={onSubmit}
              data-testid="booking-form"
              className="lg:col-span-7 bg-white rounded-3xl shadow-[0_30px_80px_-40px_rgba(22,24,63,0.35)] border border-[#EEECFB] p-6 md:p-9"
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#FC5B22] font-bold">Enquiry Form</div>
              <h3 className="font-display italic font-bold text-2xl md:text-3xl text-[#16183F] mt-1 leading-tight">
                Get your fare — instantly on WhatsApp
              </h3>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    required
                    data-testid="input-name"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Enter Your Name"
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  />
                </Field>
                <Field label="Phone" icon={<PhoneIcon className="w-4 h-4" />}>
                  <input
                    required
                    data-testid="input-phone"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="Enter Your Phone Number"
                    inputMode="tel"
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  />
                </Field>

                <Field label="Select Car Type">
                  <select
                    data-testid="select-car"
                    value={form.car_type}
                    onChange={update("car_type")}
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F]"
                  >
                    {CAR_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Trip Type">
                  <select
                    data-testid="select-trip"
                    value={form.trip_type}
                    onChange={update("trip_type")}
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F]"
                  >
                    {TRIP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Pickup Location" icon={<MapPin className="w-4 h-4" />}>
                  <input
                    required
                    data-testid="input-pickup"
                    value={form.pickup}
                    onChange={update("pickup")}
                    placeholder="Enter Pickup Location"
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  />
                </Field>
                <Field label="Drop Location" icon={<MapPin className="w-4 h-4" />}>
                  <input
                    required
                    data-testid="input-drop"
                    value={form.drop}
                    onChange={update("drop")}
                    placeholder="Enter Drop Location"
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  />
                </Field>

                <Field label="Travel Date" icon={<Calendar className="w-4 h-4" />} span2>
                  <input
                    required
                    type="date"
                    data-testid="input-date"
                    value={form.travel_date}
                    onChange={update("travel_date")}
                    min={todayISO()}
                    className="w-full bg-transparent outline-none text-[15px] text-[#16183F]"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="booking-submit-button"
                className="btn-primary mt-6 w-full py-4 rounded-full font-bold italic font-display text-[15px] tracking-wide disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Now"}
              </button>
              <p className="text-[11px] text-stone-500 mt-3 text-center">
                Your enquiry is saved and forwarded to WhatsApp instantly.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, icon, children, span2 }) {
  return (
    <label className={`block ${span2 ? "sm:col-span-2" : ""}`}>
      <div className="text-[12px] font-semibold text-[#16183F] mb-1.5">{label}</div>
      <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-[#EEECFB] bg-white focus-within:border-[#FC5B22] transition-colors duration-200">
        {icon && <span className="text-[#FC5B22]">{icon}</span>}
        {children}
      </div>
    </label>
  );
}

function Stat({ k, v }) {
  return (
    <div className="text-center rounded-2xl border border-[#EEECFB] py-4">
      <div className="font-display italic font-bold text-2xl md:text-3xl text-[#16183F] leading-none">{k}</div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mt-1.5">{v}</div>
    </div>
  );
}
