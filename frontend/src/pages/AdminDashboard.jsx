import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut, RefreshCw, Search, Phone, MessageCircle, Trash2, Filter,
  Users, ClipboardCheck, Calendar, Sparkles, ExternalLink
} from "lucide-react";
import { adminAxios, API, authHeader, clearToken, getToken } from "@/lib/adminApi";
import { BUSINESS } from "@/config/business";

const STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"];

const STATUS_STYLES = {
  new:       "bg-[#FFF1EB] text-[#FC5B22] border-[#FDD0BE]",
  contacted: "bg-[#EEF1FF] text-[#4358E8] border-[#CFD8FF]",
  confirmed: "bg-[#E9F8EF] text-[#0F7B3B] border-[#B4E7C7]",
  completed: "bg-[#EDEDED] text-[#16183F] border-[#D6D6D6]",
  cancelled: "bg-[#FDECEC] text-[#C43434] border-[#F5C1C1]",
};

const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [{ data: list }, { data: s }] = await Promise.all([
        adminAxios.get(`${API}/admin/bookings`, { headers: authHeader() }),
        adminAxios.get(`${API}/admin/stats`,    { headers: authHeader() }),
      ]);
      setBookings(list);
      setStats(s);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/admin", { replace: true });
      } else {
        toast.error("Could not fetch bookings.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin", { replace: true });
      return;
    }
    load();
  }, [load, navigate]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q.trim()) return true;
      const s = q.trim().toLowerCase();
      return (
        b.name.toLowerCase().includes(s) ||
        b.phone.toLowerCase().includes(s) ||
        b.pickup.toLowerCase().includes(s) ||
        b.drop.toLowerCase().includes(s) ||
        (b.car_type || "").toLowerCase().includes(s)
      );
    });
  }, [bookings, q, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await adminAxios.patch(`${API}/admin/bookings/${id}`, { status }, { headers: authHeader() });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      toast.success(`Marked as ${status}`);
      // Refresh stats
      const { data: s } = await adminAxios.get(`${API}/admin/stats`, { headers: authHeader() });
      setStats(s);
    } catch (err) {
      toast.error("Could not update status");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await adminAxios.delete(`${API}/admin/bookings/${id}`, { headers: authHeader() });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const logout = () => {
    clearToken();
    navigate("/admin", { replace: true });
  };

  const exportCsv = () => {
    const rows = [
      ["Date", "Name", "Phone", "Car", "Trip", "Pickup", "Drop", "Travel Date", "Status", "Message"],
      ...filtered.map((b) => [
        fmtDate(b.created_at),
        b.name, b.phone, b.car_type, b.trip_type,
        b.pickup, b.drop, b.travel_date, b.status,
        (b.message || "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nishwa-bookings-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#FBFAF7]">
      {/* Top Bar */}
      <header className="bg-[#16183F] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/nishwa-logo.jpg" alt="Nishwa" className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/20" />
            <div>
              <div className="font-display italic font-bold">Nishwa Admin</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">All Enquiries</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/15 text-xs text-white/80 hover:bg-white/10">
              <ExternalLink className="w-3.5 h-3.5" /> Public site
            </Link>
            <button
              data-testid="admin-refresh"
              onClick={load}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/15 text-xs text-white/80 hover:bg-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              data-testid="admin-logout"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FC5B22] hover:bg-[#E14812] text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Heading */}
        <div>
          <div className="font-script text-[#FC5B22] text-3xl">Owner dashboard</div>
          <h1 className="font-display italic font-bold text-3xl md:text-4xl text-[#16183F] tracking-tight">
            Bookings &amp; Enquiries
          </h1>
          <p className="text-stone-600 mt-2 text-sm">
            All enquiries from your website land here. Update status, contact riders, or export to CSV.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard label="Total"     value={stats?.total     ?? "—"} icon={<Users className="w-4 h-4" />} />
          <StatCard label="Today"     value={stats?.today     ?? "—"} icon={<Calendar className="w-4 h-4" />} accent />
          <StatCard label="New"       value={stats?.new       ?? "—"} icon={<Sparkles className="w-4 h-4" />} />
          <StatCard label="Confirmed" value={stats?.confirmed ?? "—"} icon={<ClipboardCheck className="w-4 h-4" />} />
          <StatCard label="Completed" value={stats?.completed ?? "—"} icon={<ClipboardCheck className="w-4 h-4" />} />
          <StatCard label="Cancelled" value={stats?.cancelled ?? "—"} icon={<Trash2 className="w-4 h-4" />} />
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-2.5 border border-[#EEECFB]">
            <Search className="w-4 h-4 text-[#FC5B22]" />
            <input
              data-testid="admin-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, phone, city, or car…"
              className="flex-1 bg-transparent outline-none text-sm text-[#16183F] placeholder:text-stone-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-white border border-[#EEECFB] text-sm">
              <Filter className="w-4 h-4 text-[#FC5B22]" />
              <select
                data-testid="admin-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="all">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              data-testid="admin-export"
              onClick={exportCsv}
              className="btn-navy px-4 py-2.5 rounded-full text-xs font-semibold"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-[#EEECFB] bg-white overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-stone-500">Loading bookings…</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-stone-500">
              {bookings.length === 0
                ? "No enquiries yet. When customers use the booking form, they’ll appear here."
                : "No bookings match your filter."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FBFAF7] text-[#16183F] border-b border-[#EEECFB]">
                  <tr>
                    <Th>When</Th>
                    <Th>Customer</Th>
                    <Th>Route</Th>
                    <Th>Car / Trip</Th>
                    <Th>Travel</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      data-testid={`booking-row-${b.id}`}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#FBFAF7]"} border-b border-[#EEECFB]`}
                    >
                      <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{fmtDate(b.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#16183F]">{b.name}</div>
                        <div className="text-xs text-stone-500">{b.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#16183F]">
                          {b.pickup} <span className="text-[#FC5B22]">→</span> {b.drop}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#16183F]">{b.car_type}</div>
                        <div className="text-xs text-stone-500">{b.trip_type}</div>
                      </td>
                      <td className="px-4 py-3 text-stone-700 whitespace-nowrap">{b.travel_date}</td>
                      <td className="px-4 py-3">
                        <select
                          data-testid={`status-select-${b.id}`}
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border outline-none capitalize ${STATUS_STYLES[b.status] || STATUS_STYLES.new}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${b.phone}`}
                            title="Call"
                            className="w-8 h-8 rounded-full bg-[#FFF1EB] text-[#FC5B22] grid place-items-center hover:bg-[#FDD0BE]"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`${BUSINESS.whatsappBase.replace('/91' + BUSINESS.phone, '/91' + b.phone.replace(/\D/g, ''))}?text=${encodeURIComponent(`Hi ${b.name}, this is Nishwa Travels regarding your ${b.pickup} → ${b.drop} enquiry.`)}`}
                            target="_blank" rel="noreferrer"
                            title="WhatsApp"
                            className="w-8 h-8 rounded-full bg-[#25D366] text-white grid place-items-center hover:bg-[#1EBE57]"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            title="Delete"
                            data-testid={`delete-booking-${b.id}`}
                            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-500 grid place-items-center hover:border-red-300 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {b.message && (
                          <div className="text-[11px] text-stone-500 mt-1.5 max-w-[220px] truncate" title={b.message}>
                            {b.message}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-stone-500 text-center">
          Showing {filtered.length} of {bookings.length} bookings
        </div>
      </main>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left font-display italic font-bold text-[13px] text-[#16183F]">{children}</th>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div
      data-testid={`stat-${label.toLowerCase()}`}
      className={`rounded-2xl border p-4 ${accent ? "bg-[#16183F] text-white border-[#16183F]" : "bg-white border-[#EEECFB]"}`}
    >
      <div className="flex items-center justify-between">
        <div className={`text-[10px] uppercase tracking-[0.22em] ${accent ? "text-white/70" : "text-stone-500"}`}>{label}</div>
        <div className={`w-7 h-7 rounded-lg grid place-items-center ${accent ? "bg-white/15 text-[#F5B84B]" : "bg-[#FFF1EB] text-[#FC5B22]"}`}>
          {icon}
        </div>
      </div>
      <div className={`font-display italic font-bold text-2xl mt-2 ${accent ? "text-white" : "text-[#16183F]"}`}>
        {value}
      </div>
    </div>
  );
}
