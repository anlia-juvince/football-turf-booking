import { useEffect, useState } from "react";
import type { Booking } from "../types";
import AdminGate from "../components/AdminGate";
import AdminBookingCard from "../components/AdminBookingCard";
import {
  getAdminBookings,
  getAdminSummary,
  markCollected,
  adminCancel,
} from "../api/admin";

type Summary = {
  date: string;
  total_bookings: number;
  confirmed: number;
  cancelled: number;
  earned: number;
  upi_paid: number;
  cod_pending: number;
  cod_collected: number;
};

export default function Admin() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}

function AdminDashboard() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "cod" | "upi" | "cancelled"
  >("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([
        getAdminBookings(date),
        getAdminSummary(date),
      ]);
      setBookings(b);
      setSummary(s);
    } catch {
      sessionStorage.removeItem("admin_key");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [date]);

  const handleMarkCollected = async (code: string) => {
    await markCollected(code);
    await load();
  };

  const handleCancel = async (code: string) => {
    if (!confirm("Cancel this booking?")) return;
    await adminCancel(code);
    await load();
  };

  const filtered = bookings.filter((b) => {
    if (filter === "confirmed" && b.status !== "confirmed") return false;
    if (filter === "cancelled" && b.status !== "cancelled") return false;
    if (filter === "cod" && b.payment_method !== "cod") return false;
    if (filter === "upi" && b.payment_method !== "upi") return false;

    if (search.trim()) {
      const s = search.toLowerCase();
      const hit =
        b.name.toLowerCase().includes(s) ||
        b.phone.includes(s) ||
        b.booking_code.toLowerCase().includes(s);
      if (!hit) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage bookings and payments
          </p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin_key");
            window.location.reload();
          }}
          className="text-sm text-slate-500 underline"
        >
          Log out
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium">Date:</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <button
          onClick={() => setDate(new Date().toISOString().slice(0, 10))}
          className="text-sm px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
        >
          Today
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat label="Total bookings" value={summary.total_bookings} />
          <Stat label="Earned" value={`₹${summary.earned}`} />
          <Stat label="UPI paid" value={`₹${summary.upi_paid}`} />
          <Stat
            label="COD pending"
            value={`₹${summary.cod_pending}`}
            warn={summary.cod_pending > 0}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {(["all", "confirmed", "cod", "upi", "cancelled"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )
          )}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, or code"
          className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {loading && (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
          No bookings for this date.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {!loading &&
          filtered.map((b) => (
            <AdminBookingCard
              key={b.id}
              booking={b}
              onMarkCollected={handleMarkCollected}
              onCancel={handleCancel}
            />
          ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string | number;
  warn?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`text-2xl font-semibold mt-1 ${
          warn ? "text-amber-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}