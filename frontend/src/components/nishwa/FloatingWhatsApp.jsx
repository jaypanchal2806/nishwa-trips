import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/config/business";

export default function FloatingWhatsApp() {
  const url = `${BUSINESS.whatsappBase}?text=${encodeURIComponent(`Hi ${BUSINESS.short}, I would like to book a cab.`)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp-btn"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white grid place-items-center shadow-2xl wa-pulse hover:bg-[#1EBE57] transition-colors duration-200"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
}
