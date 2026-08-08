import { useState, useEffect } from "react";
import { Phone, Menu, X, MapPin } from "lucide-react";
import { BUSINESS } from "@/config/business";

const NAV = [
  { label: "Services",    href: "#services" },
  { label: "Fleet",       href: "#fleet" },
  { label: "Locations",   href: "#locations" },
  { label: "Reviews",     href: "#reviews" },
  { label: "Contact",     href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 backdrop-blur-xl bg-[#FFFFFF]/85 border-b ${scrolled ? "border-stone-200 shadow-[0_2px_20px_-16px_rgba(28,25,23,0.35)]" : "border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" data-testid="brand-logo" className="flex items-center gap-3 group">
          <img
            src="/nishwa-logo.jpg"
            alt="Nishwa Tours & Travels"
            className="w-11 h-11 md:w-12 md:h-12 rounded-xl object-cover ring-1 ring-stone-200"
          />
          <div className="leading-tight">
            <div className="font-display font-semibold text-[15px] md:text-base">Nishwa Tours &amp; Travels</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Ahmedabad
            </div>
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className="text-sm text-stone-700 hover:text-[#FC5B22] transition-colors duration-200"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${BUSINESS.phone}`}
            data-testid="header-call-btn"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-300 text-sm font-medium hover:border-[#FC5B22] hover:text-[#FC5B22] transition-colors duration-200"
          >
            <Phone className="w-4 h-4" /> {BUSINESS.phoneDisplay}
          </a>
          <a
            href={`${BUSINESS.whatsappBase}?text=Hi%20Nishwa%20Tours,%20I%20want%20to%20book%20a%20cab.`}
            target="_blank"
            rel="noreferrer"
            data-testid="header-whatsapp-btn"
            className="btn-whatsapp inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
          >
            <span className="hidden sm:inline">Book on</span> WhatsApp
          </a>
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden ml-1 p-2 rounded-md hover:bg-stone-100"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden border-t border-stone-200 bg-[#FFFFFF]">
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[15px] text-stone-800 hover:text-[#FC5B22]"
              >
                {n.label}
              </a>
            ))}
            <a
              href={`tel:${BUSINESS.phone}`}
              className="mt-2 py-2.5 text-[15px] flex items-center gap-2 text-stone-800"
            >
              <Phone className="w-4 h-4" /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
