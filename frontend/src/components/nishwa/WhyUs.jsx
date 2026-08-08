import { Shield, Clock, BadgeIndianRupee, Sparkles, MapPinned, Navigation } from "lucide-react";
import { WHY_US } from "@/config/business";

const ICONS = [Clock, Shield, BadgeIndianRupee, Sparkles, MapPinned, Navigation];

export default function WhyUs() {
  return (
    <section data-testid="why-us-section" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="font-script text-[#FC5B22] text-3xl md:text-4xl">Why Choose Us</div>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-1 tracking-tight leading-[1.05] text-[#16183F]">
              Little details that make big journeys.
            </h2>
            <p className="text-stone-600 mt-4 leading-relaxed">
              We built Nishwa Travels around a simple idea — you should feel like a guest,
              not a passenger. Every trip is planned with that care.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {WHY_US.map((w, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={w.title}
                  data-testid={`why-item-${i}`}
                  className="rounded-2xl border border-stone-200 bg-white p-6 card-lift"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#16183F] text-[#FC5B22] grid place-items-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-display font-semibold text-lg mt-4">{w.title}</div>
                  <div className="text-sm text-stone-600 mt-1.5 leading-relaxed">{w.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
