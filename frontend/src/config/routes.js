// Auto-generated route catalog: 1000 routes sourced from bookonewaytaxi.in
// Distances are computed via haversine between city coordinates.
// Fares are derived from per-km rates that closely match bookonewaytaxi.in's pricing.
// A small set of routes has verbatim exact fares from the reference site.

import { ROUTE_SLUGS } from "@/config/routeSlugs";
import { CITY_COORDS } from "@/config/cityCoords";

// ---------- Helpers ----------
const R = 6371; // km
const toRad = (d) => (d * Math.PI) / 180;

function haversine(a, b) {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Convert straight-line distance to road distance (India avg factor ~1.35)
const roadKm = (km) => Math.round(km * 1.35);

const round100 = (n) => Math.round(n / 100) * 100;

// Rate formula tuned to match observed bookonewaytaxi.in rates
const PER_KM = { dzire: 14, ertiga: 18, innova: 35 };
const MIN_FARE = { dzire: 800, ertiga: 1000, innova: 1500 };

function computeFares(km) {
  return {
    dzire:  Math.max(round100(km * PER_KM.dzire),  MIN_FARE.dzire),
    ertiga: Math.max(round100(km * PER_KM.ertiga), MIN_FARE.ertiga),
    innova: Math.max(round100(km * PER_KM.innova), MIN_FARE.innova),
  };
}

// Slug → readable "Title Case" for display
function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function splitSlug(slug) {
  const idx = slug.indexOf("-to-");
  if (idx < 0) return null;
  return { fromSlug: slug.slice(0, idx), toSlug: slug.slice(idx + 4) };
}

// ---------- Verbatim rate overrides (from bookonewaytaxi.in) ----------
const OVERRIDES = {
  "abu-to-mumbai-airport":       { km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  "abu-to-thane":                { km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  "abu-to-mumbai-central":       { km: 770, dzire: 11550, ertiga: 16940, innova: 27720 },
  "ahmedabad-to-malsar":         { km: 180, dzire:  3000, ertiga:  4500, innova:  7500 },
  "ahmedabad-to-dhoraji":        { km: 320, dzire:  4500, ertiga:  6500, innova: 11000 },
  "ahmedabad-to-naliya":         { km: 440, dzire:  6000, ertiga:  7500, innova: 15000 },
  "ahmedabad-to-lunawada":       { km: 130, dzire:  2800, ertiga:  4000, innova:  6500 },
  "ahmedabad-to-udaipur":        { km: 260, dzire:  3300, ertiga:  4000, innova:  9000 },
  "ahmedabad-to-vadodara":       { km: 130, dzire:  1700, ertiga:  2500, innova:  5500 },
};

// ---------- Build routes ----------
const built = [];
for (const slug of ROUTE_SLUGS) {
  const parts = splitSlug(slug);
  if (!parts) continue;
  const { fromSlug, toSlug } = parts;

  const ov = OVERRIDES[slug];

  const a = CITY_COORDS[fromSlug];
  const b = CITY_COORDS[toSlug];
  let km;
  if (ov) {
    km = ov.km;
  } else if (a && b) {
    km = roadKm(haversine(a, b));
  } else {
    // Skip routes where we don't have coordinates for either city
    continue;
  }
  if (!km || km < 5) continue;

  const fares = ov
    ? { dzire: ov.dzire, ertiga: ov.ertiga, innova: ov.innova }
    : computeFares(km);

  built.push({
    slug,
    from: titleCase(fromSlug),
    to:   titleCase(toSlug),
    km,
    ...fares,
  });
}

// Sort: Ahmedabad-originated first (alphabetical by destination), then rest
built.sort((x, y) => {
  const xIsAhm = x.from.toLowerCase() === "ahmedabad" ? 0 : 1;
  const yIsAhm = y.from.toLowerCase() === "ahmedabad" ? 0 : 1;
  if (xIsAhm !== yIsAhm) return xIsAhm - yIsAhm;
  if (x.from !== y.from) return x.from.localeCompare(y.from);
  return x.to.localeCompare(y.to);
});

export const ROUTES = built;
export const ROUTE_BY_SLUG = Object.fromEntries(built.map((r) => [r.slug, r]));

// ---------- Landing-page selections ----------

// Sample routes shown on landing (uses exact-fare overrides)
export const SAMPLE_ROUTES = [
  "abu-to-mumbai-airport",
  "abu-to-thane",
  "abu-to-mumbai-central",
  "ahmedabad-to-malsar",
  "ahmedabad-to-dhoraji",
  "ahmedabad-to-naliya",
  "ahmedabad-to-lunawada",
  "ahmedabad-to-udaipur",
].map((s) => ROUTE_BY_SLUG[s]).filter(Boolean);

// Popular routes chip list on landing
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
