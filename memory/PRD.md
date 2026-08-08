# Nishwa Travels — Product Requirements

## Original Problem Statement
Single-page website like jiyaonewaycab.in for Nishwa Travels (Ahmedabad). Progressively expanded to include:
- Multi-section marketing site with booking form
- Fleet showcase (Swift Dzire / Ertiga / Innova Crysta)
- Full route catalog like bookonewaytaxi.in with per-route detail pages
- Google Maps location + Instagram
- Owner admin panel to view/manage bookings

## Business Info
- **Name**: Nishwa Travels
- **City**: Ahmedabad, Gujarat
- **Phone / WhatsApp**: +91 76005 15130
- **Email**: nishwatourandtravels@gmail.com
- **Instagram**: @nishwa_tours_travels
- **Map**: https://maps.app.goo.gl/thDTmPJm7sBEcGgR7?g_st=ic
- **Fleet**: Swift Dzire (₹11/km), Ertiga (₹14/km), Innova Crysta (₹19/km)

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui + lucide-react + sonner + react-router-dom
- **Backend**: FastAPI + Motor (async Mongo) + PyJWT
- **DB**: MongoDB — `bookings` collection

## Routes
- `/` — Landing page (Hero + booking form, services, fleet, sample routes, popular routes, why us, locations, testimonials, contact, footer)
- `/routes` — All 828 one-way routes (search + grouped by pickup city)
- `/routes/:slug` — Per-route detail page with price card, fare per car type, booking form
- `/admin` — Admin passcode login
- `/admin/dashboard` — Owner dashboard with bookings, stats, filters, CSV export, status/delete

## Backend APIs
Public:
- `GET  /api/` — health
- `POST /api/bookings` — create booking

Admin (Bearer JWT required):
- `POST   /api/admin/login` — {passcode} → {token}
- `GET    /api/admin/me` — verify token
- `GET    /api/admin/bookings` — list all bookings
- `PATCH  /api/admin/bookings/{id}` — update status / message
- `DELETE /api/admin/bookings/{id}` — remove booking
- `GET    /api/admin/stats` — totals + today + status buckets

## Core Features (Delivered — 2026-01)
- [x] Modern navy + coral orange design (Jiya-inspired), Ubuntu italic + Caveat script fonts
- [x] Custom logo + favicon
- [x] Sticky header with WhatsApp CTA + phone
- [x] Hero with "Book Now" CTA + floating car imagery
- [x] Booking form that saves to Mongo + opens WhatsApp with pre-filled message
- [x] Services grid (5 services)
- [x] Fleet showcase (3 cars with user-uploaded images and rates)
- [x] Sample Route Fares table (8 routes with exact bookonewaytaxi rates)
- [x] Popular One-Way Routes chip grid (16 routes)
- [x] 828-route catalog auto-generated from sitemap + haversine distance
- [x] Route detail pages with gradient price card + WhatsApp/Book Online buttons
- [x] All routes search page with filter by city
- [x] Why Choose Us + Locations + Testimonials sections
- [x] Contact section with Google Maps embed + Instagram + phone/email/WhatsApp
- [x] Floating WhatsApp button
- [x] **Admin panel** — passcode login (JWT 7-day tokens), dashboard with stats, search, status filter, status update, delete, CSV export, click-to-call & click-to-WhatsApp customer

## Prioritized Backlog
- **P1**: SEO meta tags per route page
- **P1**: Fare estimator on landing (type pickup + drop → instant estimate)
- **P2**: Automated email/SMS notification on new booking
- **P2**: City hub pages (e.g. /city/ahmedabad listing all routes)
- **P3**: Booking history in admin (export by date range)
- **P3**: Multi-language support (Hindi / Gujarati)
