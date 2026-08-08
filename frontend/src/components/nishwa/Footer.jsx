import { Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";
import { BUSINESS, SERVICES } from "@/config/business";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#16183F] text-[#FFFFFF] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/nishwa-logo.jpg" alt="Nishwa Tours & Travels" className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10" />
              <div>
                <div className="font-display font-semibold text-lg">{BUSINESS.name}</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">Ahmedabad · Est. {BUSINESS.established}</div>
              </div>
            </div>
            <p className="text-stone-400 mt-5 max-w-md leading-relaxed">
              A homegrown Ahmedabad cab & tour service. One-way rides, outstation trips, airport
              transfers — safely, comfortably, on your time.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={BUSINESS.instagramUrl}
                target="_blank" rel="noreferrer"
                data-testid="footer-instagram"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full grid place-items-center bg-[linear-gradient(135deg,#F58529_0%,#DD2A7B_45%,#8134AF_75%,#515BD4_100%)] text-white hover:scale-105 transition-transform duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours!`}
                target="_blank" rel="noreferrer"
                data-testid="footer-whatsapp"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full grid place-items-center bg-[#25D366] text-white hover:scale-105 transition-transform duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${BUSINESS.phone}`}
                data-testid="footer-phone"
                aria-label="Call"
                className="w-10 h-10 rounded-full grid place-items-center bg-[#FC5B22] text-white hover:scale-105 transition-transform duration-200"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-3 text-xs text-stone-400">@{BUSINESS.instagram}</div>
          </div>

          {/* Services */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#FC5B22]">Services</div>
            <ul className="mt-4 space-y-2 text-sm text-stone-300">
              {SERVICES.map((s) => (
                <li key={s.key}><a href="/#services" className="hover:text-white transition-colors">{s.title}</a></li>
              ))}
              <li><a href="/routes" className="hover:text-white transition-colors">All Routes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#FC5B22]">Contact</div>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FC5B22]" /> <a href={`tel:${BUSINESS.phone}`} className="hover:text-white">{BUSINESS.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><Mail  className="w-4 h-4 text-[#FC5B22]" /> <a href={`mailto:${BUSINESS.email}`} className="hover:text-white break-all">{BUSINESS.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FC5B22]" /> <a href={BUSINESS.mapUrl} target="_blank" rel="noreferrer" className="hover:text-white">{BUSINESS.city}</a></li>
              <li className="flex items-center gap-2"><Instagram className="w-4 h-4 text-[#FC5B22]" /> <a href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">@{BUSINESS.instagram}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-stone-400">
          <div>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</div>
          <div>Built with care in Ahmedabad, Gujarat 🇮🇳</div>
        </div>
      </div>
    </footer>
  );
}
