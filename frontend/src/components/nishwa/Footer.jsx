import { Phone, Mail, MapPin } from "lucide-react";
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
          </div>

          {/* Services */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#FC5B22]">Services</div>
            <ul className="mt-4 space-y-2 text-sm text-stone-300">
              {SERVICES.map((s) => (
                <li key={s.key}><a href="#services" className="hover:text-white transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#FC5B22]">Contact</div>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FC5B22]" /> <a href={`tel:${BUSINESS.phone}`} className="hover:text-white">{BUSINESS.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><Mail  className="w-4 h-4 text-[#FC5B22]" /> <a href={`mailto:${BUSINESS.email}`} className="hover:text-white break-all">{BUSINESS.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FC5B22]" /> {BUSINESS.city}</li>
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
