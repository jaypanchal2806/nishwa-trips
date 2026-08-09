import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

import { adminAxios, setToken } from "@/lib/adminApi";
import { BUSINESS } from "@/config/business";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const cleanPasscode = passcode.trim();

    if (!cleanPasscode) {
      toast.error("Please enter the admin passcode.");
      return;
    }

    setLoading(true);

    try {
      // POST /api/admin/login
      const response = await adminAxios.post("/admin/login", {
        passcode: cleanPasscode,
      });

      const token = response?.data?.token;

      if (!token) {
        throw new Error("No token received from server.");
      }

      // Save token
      setToken(token);

      toast.success("Admin login successful.");

      // Go to dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      if (error?.response) {
        const status = error.response.status;

        const message =
          error.response.data?.detail ||
          `Login failed (${status})`;

        toast.error(message);
      } else if (error?.request) {
        toast.error(
          "Unable to connect to the backend server."
        );
      } else {
        toast.error(
          error.message || "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="min-h-screen bg-[#16183F] text-white flex items-center justify-center px-5 py-16 relative overflow-hidden"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(252,91,34,0.18),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(252,91,34,0.12),transparent_50%)]"
      />

      <div className="w-full max-w-md relative z-10">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>

        {/* Card */}
        <div className="rounded-3xl bg-white text-[#16183F] p-7 md:p-9 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#FFF1EB] text-[#FC5B22] grid place-items-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="font-script text-[#FC5B22] text-2xl leading-none">
                Owner login
              </div>

              <div className="font-display italic font-bold text-2xl mt-0.5">
                Nishwa Admin Panel
              </div>
            </div>

          </div>

          {/* Description */}
          <p className="text-sm text-stone-600 mt-4">
            Enter your admin passcode to view all bookings and
            enquiries received on{" "}
            <span className="font-medium">
              {BUSINESS.name}
            </span>.
          </p>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="mt-6">

            <label className="block">

              <div className="text-[12px] font-semibold text-[#16183F] mb-1.5">
                Admin Passcode
              </div>

              <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-[#EEECFB] bg-white focus-within:border-[#FC5B22] transition-colors duration-200">

                <Lock className="w-4 h-4 text-[#FC5B22]" />

                <input
                  data-testid="admin-passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) =>
                    setPasscode(e.target.value)
                  }
                  placeholder="Enter passcode"
                  className="w-full bg-transparent outline-none text-[15px] text-[#16183F] placeholder:text-stone-400"
                  autoFocus
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>

            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              data-testid="admin-login-btn"
              className="btn-primary mt-6 w-full py-3.5 rounded-full font-bold italic font-display text-[15px] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
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
