import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { API, setToken } from "@/lib/adminApi";
import { BUSINESS } from "@/config/business";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      toast.error("Please enter the admin passcode.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/login`, { passcode });
      setToken(data.token);
      toast.success("Welcome back, admin.");
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen bg-[#16183F] text-white flex items-center justify-center px-5 py-16 relative overflow-hidden">
      {/* Subtle background */}
      <div aria-hidden className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(252,91,34,0.18),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(252,91,34,0.12),transparent_50%)]" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>

        <div className="rounded-3xl bg-white text-[#16183F] p-7 md:p-9 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFF1EB] text-[#FC5B22] grid place-items-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-script text-[#FC5B22] text-2xl leading-none">Owner login</div>
              <div className="font-display italic font-bold text-2xl mt-0.5">Nishwa Admin Panel</div>
            </div>
          </div>

          <p className="text-sm text-stone-600 mt-4">
            Enter your admin passcode to view all bookings and enquiries received on
            {" "}<span className="font-medium">{BUSINESS.name}</span>.
          </p>

          <form onSubmit={onSubmit} className="mt-6">
            <label className="block">
              <div className="text-[12px] font-semibold text-[#16183F] mb-1.5">Admin Passcode</div>
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-[#EEECFB] bg-white focus-within:border-[#FC5B22] transition-colors duration-200">
                <Lock className="w-4 h-4 text-[#FC5B22]" />
                <input
                  data-testid="admin-passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  autoFocus
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              data-testid="admin-login-btn"
              className="btn-primary mt-6 w-full py-3.5 rounded-full font-bold italic font-display text-[15px] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="text-[11px] text-stone-500 mt-4 text-center">
            Only the owner has access to this page.
          </div>
        </div>
      </div>
    </div>
  );
}
