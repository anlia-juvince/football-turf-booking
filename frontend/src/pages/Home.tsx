import { useEffect, useState } from "react";
import type { Turf, Slot, Booking } from "../types";
import { getTurf, getSlots } from "../api/turf";
import { createBooking, markPaid } from "../api/bookings";
import TurfHeader from "../components/TurfHeader";
import SlotGrid from "../components/SlotGrid";
import BookingModal from "../components/BookingModal";
import UpiPaymentModal from "../components/UpiPaymentModal";
import SuccessToast from "../components/SuccessToast";
import { addMyCode } from "../utils/myBookings";

export default function Home() {
  const [turf, setTurf] = useState<Turf | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  useEffect(() => {
    getTurf()
      .then(setTurf)
      .catch(() => setError("Failed to load turf"));
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await getSlots(date);
      setSlots(s);
    } catch {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line
  }, [date]);

  const confirmBooking = async (data: {
    name: string;
    phone: string;
    hours: number;
    payment_method: "upi" | "cod";
  }) => {
    if (!selectedSlot) return;

    const booking = await createBooking({
      name: data.name,
      phone: data.phone,
      date,
      start_time: selectedSlot.start_time,
      hours: data.hours,
      payment_method: data.payment_method,
    });

    addMyCode(booking.booking_code);
    setSelectedSlot(null);
    await loadSlots();

    if (data.payment_method === "upi") {
      setPendingBooking(booking);
    } else {
      setSuccessBooking(booking);
      setTimeout(() => setSuccessBooking(null), 6000);
    }
  };

  const handlePaid = async () => {
    if (!pendingBooking) return;
    await markPaid(pendingBooking.booking_code);
    setSuccessBooking(pendingBooking);
    setPendingBooking(null);
    setTimeout(() => setSuccessBooking(null), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {turf && <TurfHeader turf={turf} />}

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold">Pick a date</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && <p className="text-red-500">{error}</p>}

        {/* Slots */}
        {!loading && !error && slots.length > 0 && (
          <SlotGrid slots={slots} onSelect={setSelectedSlot} />
        )}

        {/* Empty state */}
        {!loading && !error && slots.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No slots available for this date.
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4">
          Tap any green slot to book. Grey slots are already booked.
        </p>
      </div>

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          date={date}
          onClose={() => setSelectedSlot(null)}
          onConfirm={confirmBooking}
        />
      )}

      {pendingBooking && (
        <UpiPaymentModal
          booking={pendingBooking}
          onPaid={handlePaid}
          onClose={() => setPendingBooking(null)}
        />
      )}

      {successBooking && (
        <SuccessToast
          booking={successBooking}
          onClose={() => setSuccessBooking(null)}
        />
      )}
    </div>
  );
}