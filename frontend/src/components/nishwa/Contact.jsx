import { Phone, Mail, MapPin, MessageCircle, Clock, Instagram, ExternalLink } from "lucide-react";
import { BUSINESS } from "@/config/business";

export default function Contact() {
  return (
    <section id="contact" data-testid="contact-section" className="py-20 md:py-28 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Get in touch</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] text-[#16183F]">
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
              testId="contact-instagram"
              icon={<Instagram className="w-5 h-5" />}
              label="Instagram"
              value={"@" + BUSINESS.instagram}
              href={BUSINESS.instagramUrl}
              instagram
            />
            <ContactCard
              testId="contact-hours"
              icon={<Clock className="w-5 h-5" />}
              label="Hours"
              value="24 x 7, all days"
            />
            <ContactCard
              testId="contact-location"
              icon={<MapPin className="w-5 h-5" />}
              label="Location"
              value="Ahmedabad, Gujarat"
              href={BUSINESS.mapUrl}
            />
          </div>
        </div>

        {/* Map + Directions */}
        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-white">
          <div className="h-[360px] w-full">
            <iframe
              title="Nishwa Tours & Travels — Ahmedabad location"
              src="https://www.google.com/maps?q=Ahmedabad,%20Gujarat&z=11&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              data-testid="contact-map-iframe"
            />
          </div>
          <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBFAF7] border-t border-[#EEECFB]">
            <div>
              <div className="font-display italic font-bold text-lg text-[#16183F]">Based in Ahmedabad</div>
              <div className="text-sm text-stone-600">Gujarat, India · Serving 75+ cities</div>
            </div>
            <a
              href={BUSINESS.mapUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="contact-map-cta"
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            >
              Get Directions <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href, accent, instagram, testId }) {
  const cls = accent
    ? "bg-[#25D366] text-white border-[#25D366]"
    : instagram
      ? "text-white border-transparent bg-[linear-gradient(135deg,#F58529_0%,#DD2A7B_45%,#8134AF_75%,#515BD4_100%)]"
      : "bg-white border-stone-200 text-stone-900";
  const iconBoxCls = accent || instagram
    ? "bg-white/15"
    : "bg-[#FFF1EB] text-[#FC5B22]";
  const labelCls = accent || instagram ? "text-white/80" : "text-stone-500";
  const inner = (
    <div data-testid={testId} className={`rounded-2xl border p-5 flex items-start gap-3 card-lift ${cls}`}>
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${iconBoxCls}`}>{icon}</div>
      <div>
        <div className={`text-[11px] uppercase tracking-[0.2em] ${labelCls}`}>{label}</div>
        <div className="font-display font-semibold text-base mt-1 break-all">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a>
  ) : inner;
}
