// Slug helper
const slug = (from, to) =>
  `${from}-to-${to}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// Base per-km rates (fallback when a route has no explicit fare)
const PER_KM = { dzire: 11, ertiga: 14, innova: 19 };
const round100 = (n) => Math.round(n / 100) * 100;

// Explicit fare data from bookonewaytaxi.in — used verbatim where available.
// For the rest, fares are calculated with our per-km rates and rounded to the nearest ₹100.
const RAW_ROUTES = [
  // ===== Sample routes with exact rates =====
  { from: "Abu",       to: "Mumbai Airport", km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  { from: "Abu",       to: "Thane",          km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  { from: "Abu",       to: "Mumbai Central", km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  { from: "Ahmedabad", to: "Malsar",         km: 180, dzire:  3000, ertiga:  4500, innova:  7500 },
  { from: "Ahmedabad", to: "Dhoraji",        km: 320, dzire:  4500, ertiga:  6500, innova: 11000 },
  { from: "Ahmedabad", to: "Naliya",         km: 440, dzire:  6000, ertiga:  7500, innova: 15000 },
  { from: "Ahmedabad", to: "Lunawada",       km: 130, dzire:  2800, ertiga:  4000, innova:  6500 },
  { from: "Ahmedabad", to: "Udaipur",        km: 260, dzire:  3300, ertiga:  4000, innova:  9000 },

  // ===== Ahmedabad popular routes (calculated at per-km rates) =====
  { from: "Ahmedabad", to: "Anand",       km:  70 },
  { from: "Ahmedabad", to: "Vadodara",    km: 110 },
  { from: "Ahmedabad", to: "Ankleshwar",  km: 200 },
  { from: "Ahmedabad", to: "Sirohi",      km: 240 },
  { from: "Ahmedabad", to: "Bardoli",     km: 230 },
  { from: "Ahmedabad", to: "Chotila",     km: 145 },
  { from: "Ahmedabad", to: "Sihor",       km: 215 },
  { from: "Ahmedabad", to: "Kensvilla",   km:  85 },

  // ===== More popular Gujarat routes =====
  { from: "Ahmedabad", to: "Surat",        km: 265 },
  { from: "Ahmedabad", to: "Rajkot",       km: 215 },
  { from: "Ahmedabad", to: "Jamnagar",     km: 300 },
  { from: "Ahmedabad", to: "Bhavnagar",    km: 175 },
  { from: "Ahmedabad", to: "Junagadh",     km: 320 },
  { from: "Ahmedabad", to: "Porbandar",    km: 400 },
  { from: "Ahmedabad", to: "Dwarka",       km: 445 },
  { from: "Ahmedabad", to: "Somnath",      km: 400 },
  { from: "Ahmedabad", to: "Mount Abu",    km: 225 },
  { from: "Ahmedabad", to: "Mumbai",       km: 525 },
  { from: "Ahmedabad", to: "Pune",         km: 660 },
  { from: "Ahmedabad", to: "Gandhidham",   km: 315 },
  { from: "Ahmedabad", to: "Palanpur",     km: 145 },
  { from: "Ahmedabad", to: "Mehsana",      km:  75 },
  { from: "Ahmedabad", to: "Statue of Unity", km: 200 },

  // ===== Vadodara routes =====
  { from: "Vadodara",  to: "Ahmedabad",    km: 110 },
  { from: "Vadodara",  to: "Surat",        km: 150 },
  { from: "Vadodara",  to: "Mumbai",       km: 420 },
  { from: "Vadodara",  to: "Udaipur",      km: 360 },
];

// Fill in missing fares using per-km rates, round to nearest 100
export const ROUTES = RAW_ROUTES.map((r) => ({
  slug: slug(r.from, r.to),
  from: r.from,
  to:   r.to,
  km:   r.km,
  dzire:  r.dzire  ?? round100(r.km * PER_KM.dzire),
  ertiga: r.ertiga ?? round100(r.km * PER_KM.ertiga),
  innova: r.innova ?? round100(r.km * PER_KM.innova),
}));

// Convenience lookup by slug
export const ROUTE_BY_SLUG = Object.fromEntries(ROUTES.map((r) => [r.slug, r]));

// First 8 routes = sample section on landing
export const SAMPLE_ROUTES = ROUTES.slice(0, 8);

// Popular routes list (chips on landing)
export const POPULAR_ROUTES = [
  "abu-to-mumbai-central",
  "abu-to-thane",
  "abu-to-mumbai-airport",
  "ahmedabad-to-anand",
  "ahmedabad-to-vadodara",
  "ahmedabad-to-ankleshwar",
  "ahmedabad-to-sirohi",
  "ahmedabad-to-bardoli",
  "ahmedabad-to-lunawada",
  "ahmedabad-to-malsar",
  "ahmedabad-to-dhoraji",
  "ahmedabad-to-chotila",
  "ahmedabad-to-naliya",
  "ahmedabad-to-sihor",
  "ahmedabad-to-udaipur",
  "ahmedabad-to-kensvilla",
].map((s) => ROUTE_BY_SLUG[s]).filter(Boolean);
