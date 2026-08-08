# Nishwa Tours & Travels — Product Requirements

## Original Problem Statement
User wanted a single-page website like **jiyaonewaycab.in** for their business
**Nishwa Tours & Travels** based in Ahmedabad, Gujarat. Requested Django initially,
agreed to React + FastAPI + MongoDB (faster and modern).

## Business Info
- **Name**: Nishwa Tours & Travels
- **City**: Ahmedabad, Gujarat
- **Phone / WhatsApp**: +91 76005 15130
- **Email**: Nishwatours.travels@gmail.com
- **Services**: One Way Cab, Round Trip, Local Rental, Outstation, Airport Transfer
- **Fleet**: Sedan, SUV, Ertiga, Innova Crysta

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui + lucide-react + sonner (toasts)
- **Backend**: FastAPI + Motor (async Mongo)
- **DB**: MongoDB — collection `bookings`
- Booking flow: form → `POST /api/bookings` → save to Mongo → open pre-filled WhatsApp

## User Personas
- **Traveller (primary)**: Ahmedabad-based rider needing one-way / outstation cab. Wants fast quote & WhatsApp contact.
- **Business owner (Nishwa)**: Receives enquiries in DB + on WhatsApp; can view all bookings via `GET /api/bookings`.

## Core Requirements (Delivered — 2026-01)
- [x] Sticky header with brand, nav, phone CTA, WhatsApp CTA, mobile menu
- [x] Hero with tagline, dual CTA, stats strip, hero image
- [x] Booking form (Name, Phone, Car Type, Trip Type, Pickup, Drop, Date) that saves to DB + opens WhatsApp with pre-filled message
- [x] Services grid (5 services)
- [x] Fleet showcase (4 cars with pricing, seats, luggage)
- [x] Why Us grid (6 trust factors)
- [x] Top Locations grid (12 cities) + marquee strip
- [x] Testimonials (4 reviews)
- [x] Contact section (phone, WhatsApp, email, hours, location card)
- [x] Footer with quick links
- [x] Floating WhatsApp button with pulse animation
- [x] Warm mustard/charcoal/cream palette, Outfit + DM Sans typography
- [x] Fully responsive (mobile-first)
- [x] All interactive elements have `data-testid`

## Backend APIs
- `GET  /api/` → health check
- `POST /api/bookings` → create booking (saves to Mongo)
- `GET  /api/bookings` → list all bookings (sorted desc by created_at)

## Testing
- Iteration 1: 100% pass on backend + frontend (see `/app/test_reports/iteration_1.json`)

## Prioritized Backlog
- **P1**: Simple admin page (/admin) to view bookings with basic passcode
- **P1**: Fare estimator (auto-calc price based on car type + km)
- **P2**: Multi-image gallery for fleet cars
- **P2**: SEO — meta tags for city routes, sitemap.xml
- **P2**: Route pages (Ahmedabad → Udaipur, etc.) for organic search
- **P3**: Google Maps embed for exact office location
- **P3**: SMS/email notification on new booking (SendGrid/Twilio)
