import { useEffect } from "react";
import Header from "@/components/nishwa/Header";
import Hero from "@/components/nishwa/Hero";
import Services from "@/components/nishwa/Services";
import Fleet from "@/components/nishwa/Fleet";
import WhyUs from "@/components/nishwa/WhyUs";
import Locations from "@/components/nishwa/Locations";
import Testimonials from "@/components/nishwa/Testimonials";
import Contact from "@/components/nishwa/Contact";
import Footer from "@/components/nishwa/Footer";
import FloatingWhatsApp from "@/components/nishwa/FloatingWhatsApp";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Landing() {
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div data-testid="landing-page" className="min-h-screen bg-white text-[#16183F]">
      <Header />
      <main>
        <Hero apiBase={API} />
        <Services />
        <Fleet />
        <WhyUs />
        <Locations />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
