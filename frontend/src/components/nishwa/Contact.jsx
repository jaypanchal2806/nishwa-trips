import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { BUSINESS } from "@/config/business";

export default function Contact() {
  return (
    <section id="contact" data-testid="contact-section" className="py-20 md:py-28 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-semibold">Get in touch</div>
          <h2 className="font-display font-semibold text-3xl md:text-5xl mt-2 tracking-tight leading-[1.05]">
            Talk to a real person, right now.
          </h2>
          <p className="text-stone-600 mt-4 leading-relaxed max-w-lg">
            Prefer to chat before booking? Call, WhatsApp or email us — we answer 24/7.
            Your journey with {BUSINESS.name} starts with a simple hello.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <ContactCard
              testId="contact-phone"
              icon={<Phone className="w-5 h-5" />}
              label="Call Us"
              value={BUSINESS.phoneDisplay}
              href={`tel:${BUSINESS.phone}`}
            />
            <ContactCard
              testId="contact-whatsapp"
              icon={<MessageCircle className="w-5 h-5" />}
              label="WhatsApp"
              value="Instant reply"
              href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours!`}
              accent
            />
            <ContactCard
              testId="contact-email"
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={BUSINESS.email}
              href={`mailto:${BUSINESS.email}`}
            />
            <ContactCard
              testId="contact-hours"
              icon={<Clock className="w-5 h-5" />}
              label="Hours"
              value="24 x 7, all days"
            />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg h-[420px] bg-white">
          <div className="h-full w-full grid place-items-center relative bg-[url('https://images.unsplash.com/photo-1632671794713-6167b013168c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxhaG1lZGFiYWQlMjBjaXR5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4NjE4MDk3Nnww&ixlib=rb-4.1.0&q=85')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[#1C1917]/60" />
            <div className="relative text-center text-[#FDFBF7] px-6">
              <MapPin className="w-8 h-8 mx-auto text-[#F5B84B]" />
              <div className="font-display font-semibold text-2xl md:text-3xl mt-3">Based in Ahmedabad</div>
              <div className="text-sm mt-1.5 opacity-80">Gujarat, India · Serving 75+ cities</div>
              <a
                href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20I%20want%20to%20know%20the%20office%20address.`}
                target="_blank" rel="noreferrer"
                data-testid="contact-map-cta"
                className="btn-primary mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
              >
                Ask for exact address
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href, accent, testId }) {
  const inner = (
    <div
      data-testid={testId}
      className={`rounded-2xl border p-5 flex items-start gap-3 card-lift ${accent ? "bg-[#25D366] text-white border-[#25D366]" : "bg-white border-stone-200 text-stone-900"}`}
    >
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${accent ? "bg-white/15" : "bg-[#FDF3E1] text-[#D97706]"}`}>
        {icon}
      </div>
      <div>
        <div className={`text-[11px] uppercase tracking-[0.2em] ${accent ? "text-white/80" : "text-stone-500"}`}>{label}</div>
        <div className="font-display font-semibold text-base mt-1">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}
