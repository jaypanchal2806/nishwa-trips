import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/config/business";

export default function Testimonials() {
  return (
    <section id="reviews" data-testid="testimonials-section" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-semibold">Riders love us</div>
            <h2 className="font-display font-semibold text-3xl md:text-5xl mt-2 tracking-tight leading-[1.05] max-w-xl">
              10,000+ happy journeys and counting.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_,i)=>(
              <Star key={i} className="w-5 h-5 fill-[#D97706] text-[#D97706]" />
            ))}
            <span className="ml-2 text-sm text-stone-600">4.9 / 5 average</span>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-${i}`}
              className="card-lift rounded-2xl bg-[#FDF3E1] border border-[#F5D999] p-6 flex flex-col"
            >
              <Quote className="w-7 h-7 text-[#D97706]" />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-stone-800 flex-1">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-[#F5D999] flex items-center justify-between">
                <div>
                  <div className="font-display font-semibold text-sm">{t.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Verified rider</div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_,j)=>(
                    <Star key={j} className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
