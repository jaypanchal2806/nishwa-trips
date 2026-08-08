// Central business config for Nishwa Travels
export const BUSINESS = {
  name: "Nishwa Travels",
  short: "Nishwa Travels",
  tagline: "OneWay Ride Anytime — AnyWhere from Ahmedabad",
  city: "Ahmedabad, Gujarat",
  phone: "7600515130",
  phoneDisplay: "+91 76005 15130",
  email: "nishwatourandtravels@gmail.com",
  whatsappBase: "https://wa.me/917600515130",
  mapUrl: "https://maps.app.goo.gl/thDTmPJm7sBEcGgR7?g_st=ic",
  instagram: "nishwa_tours_travels",
  instagramUrl: "https://instagram.com/nishwa_tours_travels",
  established: 2019,
};

export const CAR_TYPES = ["Swift Dzire", "Ertiga", "Innova Crysta"];
export const TRIP_TYPES = ["One Way", "Round Trip"];

export const SERVICES = [
  { key: "oneway",    title: "One Way Cab",     desc: "Pay only for one side. Perfect for city-to-city rides across Gujarat." },
  { key: "roundtrip", title: "Round Trip",      desc: "Complete round journeys with driver waiting — hassle free." },
  { key: "local",     title: "Local Rental",    desc: "Hourly & full-day rentals for city sightseeing and meetings." },
  { key: "outstation",title: "Outstation",      desc: "Long-distance travel to any city across India, at fair rates." },
  { key: "airport",   title: "Airport Transfer",desc: "On-time pickups and drops to Ahmedabad SVPI airport, 24/7." },
];

export const FLEET = [
  { name: "Swift Dzire",   img: "/dzire.jpeg", seats: "4 + 1", luggage: "2 bags", best: "City & short trips",  price: "₹11/km" },
  { name: "Ertiga",        img: "/ertiga.jpeg", seats: "6 + 1", luggage: "3 bags", best: "Family outings",       price: "₹14/km" },
  { name: "Innova Crysta", img: "/innova.webp", seats: "6 + 1", luggage: "4 bags", best: "Premium comfort",      price: "₹19/km" },
];

export const LOCATIONS = [
  "Ahmedabad", "Baroda", "Surat", "Rajkot",
  "Udaipur", "Mumbai", "Pune", "Gandhidham",
  "Dwarka", "Somnath", "Statue of Unity", "Mount Abu",
];

export const WHY_US = [
  { title: "24 / 7 Available",     desc: "Book anytime — day, night, weekend or holiday." },
  { title: "Verified Drivers",     desc: "Every driver is background-checked and courteous." },
  { title: "Transparent Pricing",  desc: "No hidden charges. Clear per-km rate before you book." },
  { title: "Clean & Sanitised Cars", desc: "Sanitised interiors, comfortable seats every trip." },
  { title: "521+ Routes Covered",  desc: "One-way rides on 500+ routes across Gujarat & India." },
  { title: "GPS Tracked",          desc: "Live tracking for the safety of your loved ones." },
];

export const TESTIMONIALS = [
  { name: "Tarana Kaushik",  text: "Had an excellent experience. Driver was extremely supportive — took us to Dwarka & Somnath. My elderly parents felt very comfortable throughout." },
  { name: "Ronak Thakar",    text: "Booked a one-way taxi to Daman. A new well-maintained Ertiga was provided. The driver was courteous and professional. Wonderful experience!" },
  { name: "Brijesh Tiwari",  text: "Excellent service! The team was polite, punctual and drove safely. Made our journey to Udaipur completely stress-free. Highly recommended." },
  { name: "Akriti Kaur",     text: "We handled our entire wedding travel logistics with Nishwa. Guests reached the venue comfortably. Absolutely stress-free for us as hosts." },
];
