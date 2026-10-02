import { useEffect, useState } from "react";
import type { Booking } from "../types";
import { getBooking, getBookingsByPhone, cancelBooking } from "../api/bookings";
import { getMyCodes } from "../utils/myBookings";
import BookingCard from "../components/BookingCard";

export default function MyBookings() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMyBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const codes = getMyCodes();
      const results = await Promise.all(
        codes.map((c) => getBooking(c).catch(() => null))
      );
      const valid = results.filter(Boolean) as Booking[];
      setBookings(valid);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

  const handleCancel = async (code: string) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(code);
      await loadMyBookings();
    } catch {
      alert("Failed to cancel. Try again.");
    }
  };

  const handlePhoneLookup = async () => {
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone");
      return;
    }
    setError("");
    setLookupLoading(true);
    try {
      const found = await getBookingsByPhone(phone);
      setBookings(found);
    } catch {
      setError("No bookings found");
    } finally {
      setLookupLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const upcoming = bookings.filter(
    (b) => b.date >= today && b.status === "confirmed"
  );
  const past = bookings.filter(
    (b) => b.date < today || b.status === "cancelled"
  );

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      <div className="flex gap-2 mb-4">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300 text-slate-700"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : "Past"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-red-500 mb-3">{error}</p>}

      {!loading && list.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
          {tab === "upcoming"
            ? "No upcoming bookings. Book a slot from the Home page."
            : "No past bookings yet."}
        </div>
      )}

      <div className="space-y-3">
        {list.map((b) => (
          <BookingCard
            key={b.booking_code}
            booking={b}
            onCancel={handleCancel}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm p-5">
        <p className="font-medium">Booked on a different device?</p>
        <p className="text-sm text-slate-500 mt-1">
          Enter your phone number to find your bookings.
        </p>
        <div className="flex gap-2 mt-3">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit phone"
            className="flex-1 border rounded-lg px-3 py-2"
            maxLength={15}
          />
          <button
            onClick={handlePhoneLookup}
            disabled={lookupLoading}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-50"
          >
            {lookupLoading ? "Searching…" : "Find"}
          </button>
        </div>
      </div>
    </div>
  );
}